import { useMemo } from "react";

import { Skeleton } from "~components/Skeleton/Skeleton";
import { MAX_BOUNTIES } from "~pages/BountyListPage";

export const BountyListSkeleton = ({ rows }: { rows?: number }) => {
  const count = rows || MAX_BOUNTIES;

  const widths = useMemo(
    () => Array.from({ length: count }).map(() => 150 * Math.random() + 50),
    [count]
  );

  return (
    <div className="space-y-4 pl-5 py-4">
      {Array.from({ length: count }).map((_, idx) => {
        return (
          <div
            className="flex flex-row h-[44px] items-center"
            style={{
              // Progressively make the list items opaque
              opacity: 1 - idx / count,
            }}
          >
            <Skeleton className="w-9 h-9 rounded-full" />

            <div className="flex flex-col ml-3 gap-1">
              <Skeleton className="h-[20px]" style={{ width: widths[idx] }} />

              <Skeleton className="w-14 h-[14px]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
