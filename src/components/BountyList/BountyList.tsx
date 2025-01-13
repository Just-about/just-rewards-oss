import classNames from "classnames";
import { useMemo } from "react";

import { BountyListItem } from "~components/BountyList/BountyListItem";

import type { BountyListItemProps } from "~components/BountyList/BountyListItem/BountyListItem";

interface BountyListProps {
  items: Array<BountyListItemProps & { id: number }>;
  className?: string;
}

export const BountyList = ({ items, className }: BountyListProps) => {
  // Make sure that the monetary details are all the same width across all rows
  const bountyListItemClassName = useMemo(() => {
    const highestValueItem = Math.max(...items.map((i) => i.maxReward));

    return {
      "w-[69px]": highestValueItem!.toString().length < 3,
      "w-[79px]": highestValueItem!.toString().length === 3,
      "w-[95px]": highestValueItem!.toString().length === 4,
    };
  }, [items]);

  return (
    <div className={classNames("space-y-4 pl-5 py-4", className)}>
      {items.map((item) => (
        <BountyListItem {...item} key={item.id} className={bountyListItemClassName} />
      ))}
    </div>
  );
};
