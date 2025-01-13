import { ListBountiesRequest, ListBountiesResponse } from "~background/messages/list-bounties";
import { backgroundMessage } from "~utils/messages/background-message";

import type { JrxBounty } from "@ja-packages/types/jarb";

export const listBounties = async ({
  sort = "hot",
  limit = 3,
  url,
}: {
  sort?: "new" | "hot";
  limit?: number;
  url?: string;
}): Promise<JrxBounty[]> => {
  const body: {
    limit?: number;
    sort?: "new" | "hot";
    filter?: { url: string };
  } = { limit, sort };

  if (url) body.filter = { url };

  const { bounties } = await backgroundMessage<ListBountiesRequest, ListBountiesResponse>("list-bounties", body);

  return bounties;
};
