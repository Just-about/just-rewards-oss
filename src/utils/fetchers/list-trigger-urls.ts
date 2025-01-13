import { GetTriggerUrlsRequest, GetTriggerUrlsResponse } from "~background/messages/list-trigger-urls";
import { backgroundMessage } from "~utils/messages/background-message";

import type { JrxTriggerUrl } from "@ja-packages/types/jarb";

export const listTriggerUrls = async ({ bountyIDs }: { bountyIDs: number[] }): Promise<JrxTriggerUrl[]> => {
  if (!bountyIDs.length) return [];
  return backgroundMessage<GetTriggerUrlsRequest, GetTriggerUrlsResponse>("list-trigger-urls", { bountyIDs }, []);
};
