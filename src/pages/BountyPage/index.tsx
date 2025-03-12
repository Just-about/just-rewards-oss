import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";
import { formatCurrency } from "@ja-packages/utils/format";
import { EventType } from "@ja-packages/utils/mixpanel";
import { Z_INDEXES } from "@ja-packages/utils/z-indexes";

import { BookmarkButton } from "~components/BookmarkButton/BookmarkButton";
import { Button } from "~components/Button";
import { ErrorPage } from "~components/ErrorPage/ErrorPage";
import { NavigateHomeButton } from "~components/NavigateHomeButton/NavigateHomeButton";
import { useRouter } from "~components/RouterOutlet";
import { NotFound } from "~components/RouterOutlet/RouterOutlet";
import { Skeleton } from "~components/Skeleton/Skeleton";
import { getBounty, trackEvent } from "~utils/fetchers";
import { usePrevious } from "~utils/hooks/use-previous";

import type { JrxBounty } from "@ja-packages/types/jarb";

const DEFAULT_BACKGROUND_URL = "https://justabout.s3.eu-central-1.amazonaws.com/community/just_about_6e25e144d6.png";

interface BountyPageProps {
  bountyID: string;
}

// FIXME: The `get-bounty` background message serializes the response, converting
// the date into a string. As a temporary workaround we're using this type to ensure
// that the `deadline` is treated as a string
// See https://app.asana.com/0/1204213772348254/1208714598988140
type ParsedJrxBounty = Omit<JrxBounty, "deadline"> & {
  deadline: string | null;
};

export const BountyPage = ({ bountyID }: BountyPageProps) => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [bounty, setBounty] = useState<ParsedJrxBounty>();

  const isLoading = useMemo(() => isFetching && !bounty, [isFetching, bounty]);

  const loadBounty = useCallback(async () => {
    setIsError(false);
    setIsFetching(true);

    getBounty(Number(bountyID))
      .then((data) => setBounty(data as ParsedJrxBounty))
      .catch((e) => setIsError(true))
      .finally(() => setIsFetching(false));
  }, [setIsError, setIsFetching, setBounty]);

  useEffect(() => {
    loadBounty();
  }, [loadBounty]);

  const deadline = useMemo(() => {
    if (!bounty?.deadline) return "";
    const bountyDeadline = new Date(bounty.deadline);
    const year = bountyDeadline.getFullYear();
    const month = bountyDeadline.toLocaleString("default", { month: "long" });
    const day = bountyDeadline.getDate();
    const isPM = bountyDeadline.getHours() >= 12;
    const hour = bountyDeadline.getHours() - (isPM ? 12 : 0);
    const hasMinutes = !!bountyDeadline.getMinutes();
    const minute = `${bountyDeadline.getMinutes()}`.padStart(2, "0");
    // Time should display 0 as 12, and only include minutes if not on the hour
    const time = `${hour || 12}${hasMinutes ? `:${minute}` : ""}`;
    return `${time}${isPM ? "pm" : "am"}, ${month} ${day}, ${year}`;
  }, [bounty]);

  const handleOpenRules = useCallback(async () => {
    if (!bounty) return;

    await trackEvent({
      properties: {
        location: "view-rules",
      },
      type: EventType.JRX_BUTTON_CLICKED,
    });
    router.openExternalUrl(bounty.url);
  }, [router, bounty?.url]);

  const previousBounty = usePrevious(bounty);
  // Don't re-do the fade-in-animation when just re-fetching the same bounty
  // as-is the case when performing a bookmark...
  const animation = useMemo(
    () => (previousBounty?.id === bounty?.id ? "" : "fade-in-animation"),
    [previousBounty, bounty]
  );
  // For some reason, `capitalize` in the CSS is being overridden so it is capitalized using JS
  const preferredSubmissionType = useMemo(() => {
    if (!bounty) return "";
    const { preferredSubmissionType: psType } = bounty;
    return psType.charAt(0).toUpperCase() + psType.slice(1);
  }, [bounty]);

  // TODO: add loading state
  if (isError) return <ErrorPage onRetry={loadBounty} />;
  if (!isFetching && !bounty) return <NotFound>bounty {bountyID}</NotFound>;

  return (
    <div className="relative flex flex-col min-h-[420px] overflow-y-scroll scrollbar-hide">
      <NavigateHomeButton borderless />

      <div
        className="absolute top-0 left-0 w-full h-[260px]"
        style={{
          backgroundImage: `url(${bounty?.community?.backgroundImageURL || DEFAULT_BACKGROUND_URL})`,
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_IMAGE,
        }}
      />

      <div className="relative flex row h-[120px]" style={{ zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_CONTENT }}>
        {bounty && (
          <div
            className={classNames(
              "flex my-auto items-center justify-start",
              "p-sm bg-neutral-900 rounded-r-xl",
              animation
            )}
          >
            <p className="text-right">
              <span className="text-3xl tracking-[-0.02em] font-bold font-['Basic Sans'] leading-[90%] text-[#F8B820] mr-xxxxs">
                $
              </span>
              <span className="text-3xl tracking-[-0.02em] font-bold font-['Basic Sans'] leading-[90%] text-white">
                {formatCurrency(bounty?.maxReward, {
                  removeDecimalsWhenInteger: true,
                })}
              </span>
            </p>
          </div>
        )}
      </div>

      <div
        className={classNames(
          "relative flex flex-col h-[300px]",
          "bg-gradient-to-b from-transparent via-neutral-900 to-neutral-800"
        )}
        style={{ zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_CONTENT }}
      >
        <div className="p-lg">
          <div className="mb-xs">
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <span
                className={classNames(
                  "text-white text-3xl leading-[25.6px] font-['Basic Sans'] font-bold tracking-[-0.02em]",
                  animation
                )}
              >
                {bounty!.title}
              </span>
            )}
          </div>

          <div className="mb-2">
            {isLoading ? (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-[20px] w-full" />
                <div className="flex gap-1">
                  <Skeleton className="h-[20px] w-20" />
                  <Skeleton className="h-[20px] w-40" />
                </div>
                <Skeleton className="h-[20px] w-56" />
              </div>
            ) : (
              <span className={classNames("text-base leading-[19.2px] text-neutral-400", animation)}>
                {bounty?.description}
              </span>
            )}
          </div>

          {bounty && (
            <div className="overflow-auto">
              <div className="mb-xxxs">
                <span
                  className={classNames(
                    "rounded-xxxs py-min px-xxxxs  mr-xxxs bg-primary-600 bg-opacity-[0.16]",
                    "text-sm text-neutral-400 leading-[16.8px]"
                  )}
                >
                  {bounty.community.name}
                </span>
                <span
                  className={classNames(
                    "rounded-xxxs py-min px-xxxxs bg-white/[0.08]",
                    "text-sm text-neutral-400 leading-[16.8px]"
                  )}
                >
                  {preferredSubmissionType}
                </span>
              </div>
              <div className="px-min">
                <span className="text-min leading-[14.4px] text-neutral-400">
                  {deadline ? `Closes ${deadline}` : "Closed"}
                </span>
              </div>
            </div>
          )}
        </div>

        {bounty && (
          <div className="flex flex-col mt-auto">
            <div className={classNames("flex row gap-2 items-end h-full px-lg pt-xxxxs pb-[23px]", animation)}>
              <Button
                color="purple"
                onClick={() => {
                  trackEvent({
                    properties: {
                      bountyId: bounty.id,
                    },
                    type: EventType.JRX_BOUNTY_SUBMISSION_INTENT_STARTED,
                  });
                  router.openExternalUrl(`${bounty.url}?referrer=jrx`);
                }}
                size="sm"
                iconClassName="!text-[14px]"
                iconLeft={CircleRightArrowSolid}
              >
                Submit
              </Button>

              <Button color="grey" size="sm" onClick={handleOpenRules}>
                View rules
              </Button>

              <BookmarkButton
                communitySlug={bounty.community.slug}
                postID={bounty.postID}
                isBookmarked={bounty.isBookmarked}
                onBookmark={loadBounty}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
