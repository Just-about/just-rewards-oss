import { useCallback, useEffect, useState } from "react";

import { BountyList } from "~components/BountyList";
import { BountyListSkeleton } from "~components/BountyList/BountyListSkeleton";
import { ErrorPage } from "~components/ErrorPage/ErrorPage";
import { Tabber } from "~components/Tabber";
import { WelcomeMessage } from "~components/WelcomeMessage";
import { listTrendingBounties } from "~utils/fetchers/list-trending-bounties";

import type { Tab } from "~components/Tabber/types";

export const IndexPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tabs, setTabs] = useState<Tab[] | null>(null);

  const loadBounties = useCallback(() => {
    const listBounties = async () => {
      const resp = await listTrendingBounties();

      setTabs([
        {
          id: "hot-rewards",
          label: "Hot rewards",
          content: (
            <BountyList
              items={resp.hot.map((bounty) => ({
                communityName: bounty.community.name,
                href: bounty.url,
                id: bounty.id,
                maxReward: bounty.maxReward,
                submissionType: bounty.preferredSubmissionType,
                title: bounty.title,
              }))}
            />
          ),
        },
        {
          id: "new",
          label: "New",
          content: (
            <BountyList
              items={resp.new.map((bounty) => ({
                communityName: bounty.community.name,
                href: bounty.url,
                id: bounty.id,
                maxReward: bounty.maxReward,
                submissionType: bounty.preferredSubmissionType,
                title: bounty.title,
              }))}
            />
          ),
        },
      ]);
    };

    setIsLoading(true);
    listBounties()
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, setIsError, setTabs]);

  useEffect(() => {
    loadBounties();
  }, [loadBounties]);

  if (isError) return <ErrorPage onRetry={loadBounties} />;

  return (
    <>
      <WelcomeMessage />

      {/* When tabs are given a null value, it'll be in the loading state */}
      <Tabber tabs={tabs} />

      {isLoading && <BountyListSkeleton />}
    </>
  );
};
