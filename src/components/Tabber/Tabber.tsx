import classNames from "classnames";
import { useMemo, useState } from "react";

import { Skeleton } from "~components/Skeleton/Skeleton";

import type { Tab } from "~components/Tabber/types";

interface TabberProps {
  tabs: Tab[] | null;
}

export const Tabber = ({ tabs }: TabberProps) => {
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);
  const activeTabID = useMemo(
    () => (tabs && tabs.length > 0 && selectedTabId === null ? tabs[0].id : selectedTabId),
    [selectedTabId, tabs]
  );
  const activeTabContent = useMemo(() => {
    if (!tabs) return null;

    const activeTab = tabs.find((tab) => tab.id === activeTabID);
    if (!activeTab) return null;

    return activeTab.content;
  }, [activeTabID]);

  return (
    <div className="flex flex-col h-full overflow-hidden items-stretch pb-[180px]">
      <div className="flex flex-row items-center border-y border-white/[0.08] px-5 h-[42px] flex-shrink-0">
        {(tabs?.length || 0) > 1 ? (
          tabs?.map(({ content, id, label }) => (
            <div
              className={classNames("flex items-center mr-5 h-full border-b-2", {
                "border-white": activeTabID === id,
                "border-transparent": activeTabID !== id,
              })}
              key={id}
            >
              <button
                className={classNames("font-['BasicSans'] font-bold text-base text-white leading-[120%] select-none", {
                  "opacity-50": activeTabID !== id,
                })}
                onClick={() => setSelectedTabId(id)}
                onKeyDown={() => setSelectedTabId(id)}
                type="button"
              >
                {label}
              </button>
            </div>
          ))
        ) : (
          <div className="flex gap-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-14 h-4" />
          </div>
        )}
      </div>

      {activeTabContent && (
        <div className="fade-in-animation overflow-hidden flex-shrink min-h-[0]">{activeTabContent}</div>
      )}
    </div>
  );
};
