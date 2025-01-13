import { useCallback, useEffect, useMemo, useState } from "react";

import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";
import { formatCurrency } from "@ja-packages/utils/format";
import { EventType } from "@ja-packages/utils/mixpanel";
import { Z_INDEXES } from "@ja-packages/utils/z-indexes";

import { Button } from "~components/Button";
import { ErrorPage } from "~components/ErrorPage/ErrorPage";
import { NavigateHomeButton } from "~components/NavigateHomeButton/NavigateHomeButton";
import { useRouter } from "~components/RouterOutlet";
import { NotFound } from "~components/RouterOutlet/RouterOutlet";
import { Skeleton } from "~components/Skeleton/Skeleton";
import { getBounty, trackEvent } from "~utils/fetchers";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bounty, setBounty] = useState<ParsedJrxBounty>();

  const loadBounty = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    getBounty(Number(bountyID))
      .then((data) => setBounty(data as ParsedJrxBounty))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [setIsError, setIsLoading, setBounty]);

  useEffect(() => {
    loadBounty();
  }, [loadBounty]);

  const deadline = useMemo(() => {
    if (!bounty?.deadline) return "";
    const bountyDeadline = new Date(bounty.deadline);
    const year = bountyDeadline.getFullYear();
    const month = bountyDeadline.getMonth() + 1;
    const day = bountyDeadline.getDate();
    const hour = bountyDeadline.getHours();
    const minute = `${bountyDeadline.getMinutes()}`.padStart(2, "0");
    return `${hour}:${minute} ${day}/${month}/${year}`;
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

  // TODO: add loading state
  if (isError) return <ErrorPage onRetry={loadBounty} />;
  if (!isLoading && !bounty) return <NotFound>bounty {bountyID}</NotFound>;

  return (
    <>
      <NavigateHomeButton borderless />

      <div className="relative">
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

        <div className="relative flex row mb-6 mt-3" style={{ zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_CONTENT }}>
          {isLoading ? (
            <Skeleton className="w-[160px] h-[160px] ml-5" />
          ) : (
            <img
              alt="bounty avatar"
              src={bounty?.community?.avatarURL}
              className="w-[160px] h-[160px] object-fit ml-5 fade-in-animation"
            />
          )}

          {bounty && (
            <div className="flex items-center justify-end grow fade-in-animation">
              <div className="flex items-center px-4 bg-[#252435] border-l-2 border-y-2 border-white rounded-l-full">
                <p className="text-right my-3">
                  <span className="text-[48px] leading-[100%] font-['Poppins'] text-[#F8B820] font-[400]">$</span>
                  <span className="text-[48px] leading-[100%] font-semibold text-white font-['Poppins']">
                    {formatCurrency(bounty?.maxReward, {
                      removeDecimalsWhenInteger: true,
                    })}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative mx-5" style={{ zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_CONTENT }}>
          <div className="mb-1">
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <span className="text-white font-['Poppins'] font-bold text-2xl/8 fade-in-animation">
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
              <span className="text-white font-['SourceSans3'] !leading-[22px] text-base fade-in-animation">
                {bounty?.description}
              </span>
            )}
          </div>

          <div className=" mb-4">
            {isLoading ? (
              <Skeleton className="h-[20px] w-20" />
            ) : (
              <span className="text-white/60 text-sm font-['SourceSans3'] fade-in-animation">
                In {bounty?.community?.name} {deadline ? `| Closes ${deadline}` : ""}
              </span>
            )}
          </div>

          {bounty && (
            <div className="flex row gap-2 fade-in-animation">
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
                iconLeft={CircleRightArrowSolid}
              >
                Submit
              </Button>

              <Button color="grey" size="sm" onClick={handleOpenRules}>
                View rules
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
