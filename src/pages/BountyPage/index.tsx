import { useCallback, useEffect, useState } from "react";

import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";
import { formatCurrency } from "@ja-packages/utils/format";
import { Z_INDEXES } from "@ja-packages/utils/z-indexes";

import { Button } from "~components/Button";
import { ErrorPage } from "~components/ErrorPage/ErrorPage";
import { NavigateHomeButton } from "~components/NavigateHomeButton/NavigateHomeButton";
import { useRouter } from "~components/RouterOutlet";
import { NotFound } from "~components/RouterOutlet/RouterOutlet";
import { Skeleton } from "~components/Skeleton/Skeleton";
import { Tracking } from "~mixpanel";
import { EventType } from "~mixpanel/events";
import { getBounty } from "~utils/fetchers";

import type { JrxBounty } from "@ja-packages/types/jarb";

const DEFAULT_BACKGROUND_URL =
  "https://justabout.s3.eu-central-1.amazonaws.com/community/just_about_6e25e144d6.png";

interface BountyPageProps {
  bountyID: string;
}

export const BountyPage = ({ bountyID }: BountyPageProps) => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bounty, setBounty] = useState<JrxBounty | null>();

  const loadBounty = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    getBounty(Number(bountyID))
      .then((data) => setBounty(data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [setIsError, setIsLoading, setBounty]);

  useEffect(() => {
    loadBounty();
  }, [loadBounty]);

  const handleOpenRules = useCallback(async () => {
    if (!bounty) return;

    await Tracking.scheduleTrack(EventType.BUTTON_CLICKED, {
      location: "view-rules",
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
            backgroundImage: `url(${
              bounty?.community?.backgroundImageURL || DEFAULT_BACKGROUND_URL
            })`,
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_IMAGE,
          }}
        />

        <div
          className="relative flex row mb-6 mt-3"
          style={{ zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_CONTENT }}
        >
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
                  <span className="text-[48px] leading-[100%] font-['Poppins'] text-[#F8B820] font-[400]">
                    $
                  </span>
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

        <div
          className="relative mx-5"
          style={{ zIndex: Z_INDEXES.JRX_BOUNTY_PAGE_CONTENT }}
        >
          <h1 className="text-white font-['Poppins'] font-bold text-xl mb-1">
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <span className="fade-in-animation">{bounty!.title}</span>
            )}
          </h1>

          <p className="text-white font-['SourceSans3'] !leading-[22px] text-md mb-2">
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
              <span className="fade-in-animation">{bounty?.description}</span>
            )}
          </p>

          <p className="text-white/60 text-sm font-['SourceSans3'] mb-4">
            {isLoading ? (
              <Skeleton className="h-[20px] w-20" />
            ) : (
              <span className="fade-in-animation">
                In {bounty?.community?.name}
              </span>
            )}
          </p>

          {bounty && (
            <div className="flex row gap-2 fade-in-animation">
              <Button
                color="purple"
                href={`${bounty?.url}?referrer=jrx`}
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
