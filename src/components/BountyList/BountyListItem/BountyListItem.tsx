import classNames from "classnames";
import { useCallback, useMemo } from "react";

import { formatCurrency } from "@ja-packages/utils/format";
import { EventType } from "@ja-packages/utils/mixpanel";

import { useRouter } from "~components/RouterOutlet";
import { trackEvent } from "~utils/fetchers";

export interface BountyListItemProps {
  communityName: string;
  maxReward: number;
  submissionType: "image" | "link" | "text" | "video";
  title: string;
  id: number;
  className?: string | object;
}

const tagClass = "text-sm text-neutral-400 py-min px-xxxxs rounded-xxxs font-['SourceSans3']";

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
    await trackEvent({
      type: EventType.JRX_CLICKED_BOUNTY_DETAIL_FROM_LIST_VIEW,
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
      className="flex flex-row justify-between text-left hover:opacity-90 cursor-pointer w-full"
      onClick={handleClick}
    >
      <div>
        <p className="text-white font-['BasicSans'] font-bold text-xl leading-[90%] mb-[8px] pr-2">{title}</p>

        <div className="flex gap-[10px]">
          <p className={classNames(tagClass, "bg-[#8A30F4]/[0.16]")}>{communityName}</p>
          <p className={classNames(tagClass, "bg-white/[0.08] capitalize")}>{submissionType}</p>
        </div>
      </div>

      <div
        className={classNames(
          className,

          "flex items-center h-[44px] min-w-[75px] px-3.5 pr-2 bg-neutral-900 rounded-l-md ml-2"
        )}
      >
        <p className="text-left">
          <span className="text-2xl leading-[100%] font-['BasicSans'] text-caution-300 font-semibold">$</span>

          <span className="text-2xl leading-[100%] font-['BasicSans'] font-semibold text-white">{reward}</span>
        </p>
      </div>
    </button>
  );
};
