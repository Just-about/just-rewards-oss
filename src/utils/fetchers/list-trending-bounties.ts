import { listBounties } from "./list-bounties";

import type { JrxBounty } from "@ja-packages/types/jarb";

type ListTrendingBountiesResponse = Promise<{
  new: JrxBounty[];
  hot: JrxBounty[];
}>;

export const listTrendingBounties =
  async (): Promise<ListTrendingBountiesResponse> => {
    const bounties: {
      new: JrxBounty[];
      hot: JrxBounty[];
    } = {
      new: [],
      hot: [],
    };

    try {
      bounties.hot = await listBounties({ sort: "hot" });
    } catch {
      bounties.hot = [];
    }

    try {
      bounties.new = await listBounties({ sort: "new" });
    } catch {
      bounties.new = [];
    }

    return bounties;
  };
