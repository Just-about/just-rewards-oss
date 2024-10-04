import { backgroundMessage } from "~utils/messages/background-message";

import type {
  UpdateCurrentBountiesRequest,
  UpdateCurrentBountiesResponse,
} from "~background/messages/update-current-bounties";

export const updateCurrentBounties = async ({
  ids,
}: { ids?: number[] } = {}): Promise<void> => {
  backgroundMessage<
    UpdateCurrentBountiesRequest,
    UpdateCurrentBountiesResponse
  >("update-current-bounties", { ids });
};
