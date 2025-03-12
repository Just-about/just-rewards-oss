import classNames from "classnames";
import { useMemo } from "react";

import { ArrowRightIconSolid } from "@ja-packages/icons/solid/ArrowRight";
import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";

import { BountyListItem } from "~components/BountyList/BountyListItem";
import { Button } from "~components/Button";

import type { BountyListItemProps } from "~components/BountyList/BountyListItem/BountyListItem";

interface BountyListProps {
  items: Array<BountyListItemProps & { id: number }>;
  className?: string;
}

export const BountyList = ({ items, className }: BountyListProps) => {
  // Make sure that the monetary details are all the same width across all rows
  const bountyListItemClassName = useMemo(() => {
    const highestValueItem = Math.max(...items.map((i) => i.maxReward));
    if (!highestValueItem) return "";

    return {
      "w-[69px]": highestValueItem!.toString().length < 3,
      "w-[79px]": highestValueItem!.toString().length === 3,
      "w-[95px]": highestValueItem!.toString().length === 4,
    };
  }, [items]);

  if (items.length === 0)
    return (
      <div
        className={classNames(
          "space-y-4 px-5 py-4 w-full flex flex-col items-center justify-center text-center mt-12",
          className
        )}
      >
        <p className="text-neutral-400">
          There’s a world of opportunities
          <br /> available at{" "}
          <a href="https://justabout.com" className="underline">
            justabout.com
          </a>
        </p>

        <Button
          color="light-purple"
          iconLeft={CircleRightArrowSolid}
          className="mx-auto"
          ghost
          href="https://justabout.com"
        >
          Take me there!
        </Button>
      </div>
    );

  return (
    <div
      className={classNames(
        "h-full space-y-4 pl-5 py-4 overflow-y-scroll scrollbar-hide flex flex-col flex-shrink",
        className
      )}
    >
      {items.map((item) => (
        <BountyListItem {...item} key={item.id} className={bountyListItemClassName} />
      ))}
    </div>
  );
};
