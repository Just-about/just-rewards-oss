import classNames from "classnames";
import { useCallback, useMemo } from "react";

import { FilmIconSolid } from "@ja-packages/icons/solid/Film";
import { ImageIconSolid } from "@ja-packages/icons/solid/Image";
import { LinkIconSolid } from "@ja-packages/icons/solid/Link";
import { QuoteIconSolid } from "@ja-packages/icons/solid/Quote";
import { formatCurrency } from "@ja-packages/utils/format";
import { EventType } from "@ja-packages/utils/mixpanel";

import { useRouter } from "~components/RouterOutlet";
import { SubmissionIcon } from "~components/SubmissionIcon";
import { Tracking } from "~mixpanel";

export interface BountyListItemProps {
  communityName: string;
  maxReward: number;
  submissionType: "image" | "link" | "text" | "video";
  title: string;
  id: number;
  className?: string | object;
}

export const BountyListItem = ({
  communityName,
  maxReward,
  submissionType,
  title,
  id,
  className,
}: BountyListItemProps) => {
  const router = useRouter();

  const handleClick = useCallback(async () => {
    await Tracking.trackEventInBackground({
      eventType: EventType.CLICKED_BOUNTY_DETAIL_FROM_LIST_VIEW,
      eventProperties: {},
    });
    router.push(`/bounties/${id}`);
  }, [router, id]);

  const reward = useMemo(
    () =>
      formatCurrency(maxReward, {
        removeDecimalsWhenInteger: true,
        addCommas: true,
      }),
    [maxReward]
  );

  return (
    <button
      type="button"
      className="flex flex-row items-center w-full text-left hover:opacity-90 cursor-pointer"
      onClick={handleClick}
    >
      {submissionType === "text" && (
        <SubmissionIcon
          backgroundHex="#227EFA"
          icon={QuoteIconSolid}
          iconClassName="rotate-180"
        />
      )}
      {submissionType === "image" && (
        <SubmissionIcon backgroundHex="#09D380" icon={ImageIconSolid} />
      )}
      {submissionType === "video" && (
        <SubmissionIcon backgroundHex="#8A30F4" icon={FilmIconSolid} />
      )}
      {submissionType === "link" && (
        <SubmissionIcon backgroundHex="#43415F" icon={LinkIconSolid} />
      )}

      <div className="ml-3">
        <p className="text-white font-['Poppins'] font-semibold text-[16px] leading-tight mb-1 pr-2">
          {title}
        </p>

        <p className="text-white/[0.6] font-['SourceSans3'] text-[12px] leading-[120%]">
          in {communityName}
        </p>
      </div>

      <div className=" flex items-center grow justify-end">
        <div
          className={classNames(
            className,

            "flex items-center h-[44px] px-3.5 pr-2 bg-[#252435] border-l-2 border-y-2 border-white rounded-l-full"
          )}
        >
          <p className="text-left mt-[5px]">
            <span className="text-[24px] leading-[100%] font-['Poppins'] text-[#F8B820] font-[400]">
              $
            </span>

            <span className="text-[24px] leading-[100%] font-['Poppins'] font-semibold text-white">
              {reward}
            </span>
          </p>
        </div>
      </div>
    </button>
  );
};
