import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";

import { ArrowUpRightFromSquareIconSolid } from "@ja-packages/icons/solid/ArrowUpRightFromSquare";
import { NEXT_APP_PATHS } from "@ja-packages/utils/paths";

import { BountyList } from "~components/BountyList";
import { BountyListSkeleton } from "~components/BountyList/BountyListSkeleton";
import { ErrorPage } from "~components/ErrorPage/ErrorPage";
import { NavigateHomeButton } from "~components/NavigateHomeButton/NavigateHomeButton";
import { NotFound } from "~components/RouterOutlet/RouterOutlet";
import { batchGetBounties, listBounties } from "~utils/fetchers";

import type { JrxBounty } from "@ja-packages/types/jarb";

export const MAX_BOUNTIES = 4;

interface BountyListPageProps {
  bountyIDs: string[] | string;
}

export const BountyListPage = ({ bountyIDs }: BountyListPageProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bounties, setBounties] = useState<JrxBounty[]>([]);
  const [hotBounties, setHotBounties] = useState<JrxBounty[]>([]);

  const load = useCallback(() => {
    const loadBounties = async () => {
      setIsError(false);
      setIsLoading(true);

      const newBounties = await batchGetBounties({
        ids: (Array.isArray(bountyIDs) ? bountyIDs : [bountyIDs]).map(Number),
      });
      const fallbackBounties = await listBounties({
        sort: "hot",
        limit: MAX_BOUNTIES,
      });

      // Deduplicate the hot bounties so they do not show twice in the "More available rewards" section
      const maximumNumberOfHotBounties = MAX_BOUNTIES - newBounties.length;

      const newHotBounties = fallbackBounties
        .filter((newHotBounty) =>
          newBounties.every((newBounty) => newBounty.id !== newHotBounty.id)
        )
        .slice(0, maximumNumberOfHotBounties);

      setBounties(newBounties);
      setHotBounties(newHotBounties);
    };

    loadBounties()
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [bountyIDs, setIsError, setIsLoading]);

  useEffect(() => {
    load();
  }, [bountyIDs]);

  if (isError) return <ErrorPage onRetry={load} />;

  return (
    <>
      <NavigateHomeButton />

      {
        // eslint-disable-next-line no-nested-ternary
        isLoading ? (
          <BountyListSkeleton rows={2} />
        ) : bounties.length > 0 ? (
          <BountyList
            className="fade-in-animation"
            items={bounties.map((bounty) => ({
              communityName: bounty.community.name,
              href: bounty.url,
              id: bounty.id,
              maxReward: bounty.maxReward,
              submissionType: bounty.preferredSubmissionType,
              title: bounty.title,
            }))}
          />
        ) : (
          <NotFound>Unable to find the list of bounties provided</NotFound>
        )
      }

      {!isLoading && hotBounties.length > 0 && (
        <div className="fade-in-animation">
          <div className="px-5 flex flex-row items-center w-full">
            <span className="shrink-1 grow-0 pr-2 select-none font-['Poppins'] text-[12px] text-white/[0.4]">
              More available rewards
            </span>
            <div className="border-t border-white/[0.2] flex-1" />
          </div>

          <BountyList
            items={hotBounties.map((bounty) => ({
              communityName: bounty.community.name,
              href: bounty.url,
              id: bounty.id,
              maxReward: bounty.maxReward,
              submissionType: bounty.preferredSubmissionType,
              title: bounty.title,
            }))}
          />
        </div>
      )}

      <div className="pl-5">
        <a
          href={`${
            process.env.PLASMO_PUBLIC_SITE_URL
          }${NEXT_APP_PATHS.BOUNTIES_FEED()}`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            className={classNames(
              "rounded-md py-[10px] px-[14px] flex items-center justify-center cursor-pointer transition-colors",
              "bg-[#252435] hover:opacity-90"
            )}
            type="button"
          >
            <span
              className={classNames(
                "text-sm text-white leading-[18px]",
                "font-semibold flex gap-2 items-center justify-center font-['Poppins']"
              )}
            >
              <ArrowUpRightFromSquareIconSolid />
              View all rewards
            </span>
          </button>
        </a>
      </div>
    </>
  );
};
