import {
  GetBountyRequest,
  GetBountyResponse,
} from "~background/messages/get-bounty";
import { backgroundMessage } from "~utils/messages/background-message";

import type { JrxBounty } from "@ja-packages/types/jarb";

export const getBounty = async (id: number): Promise<JrxBounty | null> =>
  backgroundMessage<GetBountyRequest, GetBountyResponse>("get-bounty", { id });
