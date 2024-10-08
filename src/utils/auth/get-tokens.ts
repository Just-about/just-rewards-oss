import { backgroundMessage } from "~utils/messages/background-message";

import type {
  GetCookiesRequest,
  GetCookiesResponse,
} from "~background/messages/get-cookies";

export const getTokens = async () => {
  const cookies = await backgroundMessage<
    GetCookiesRequest,
    GetCookiesResponse
  >("get-cookies", {}, []);

  return Object.fromEntries(
    cookies
      .filter((cookie) => ["ja-access", "ja-refresh"].includes(cookie.name))
      .map((cookie) => [cookie.name, cookie.value])
  );
};
