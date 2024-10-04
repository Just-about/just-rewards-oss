import {
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
} from "~background/messages/refresh-access-token";
import { backgroundMessage } from "~utils/messages/background-message";

export const refreshAccessToken = async (): Promise<string | null> => {
  const response = await backgroundMessage<
    RefreshAccessTokenRequest,
    RefreshAccessTokenResponse
  >("refresh-access-token", {}, null);

  return response ? response.accessToken : null;
};
