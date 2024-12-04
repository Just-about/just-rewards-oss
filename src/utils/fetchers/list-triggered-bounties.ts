import {
  ListTriggeredBountiesRequest,
  ListTriggeredBountiesResponse,
} from "~background/messages/list-triggered-bounties";
import { backgroundMessage } from "~utils/messages/background-message";

export const listTriggeredBounties = async ({ url }: { url: string }) => {
  const { bounties, rewardsAvailable } = await backgroundMessage<
    ListTriggeredBountiesRequest,
    ListTriggeredBountiesResponse
  >("list-triggered-bounties", { filter: { url } });

  return { bounties, rewardsAvailable };
};
