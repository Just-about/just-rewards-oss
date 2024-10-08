import { backgroundMessage } from "~utils/messages/background-message";

import type {
  DeleteTokensRequest,
  DeleteTokensResponse,
} from "~background/messages/sign-out";

export const signOut = async (): Promise<boolean> => {
  const { success } = await backgroundMessage<
    DeleteTokensRequest,
    DeleteTokensResponse
  >("sign-out", {});
  return success;
};
