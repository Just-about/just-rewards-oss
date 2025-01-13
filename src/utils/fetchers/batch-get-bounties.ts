import { BatchGetBountiesRequest, BatchGetBountiesResponse } from "~background/messages/batch-get-bounties";
import { backgroundMessage } from "~utils/messages/background-message";

export const batchGetBounties = async ({ ids }: { ids: number[] }) => {
  const response = await backgroundMessage<BatchGetBountiesRequest, BatchGetBountiesResponse>("batch-get-bounties", {
    ids,
  });
  return response.bounties;
};
