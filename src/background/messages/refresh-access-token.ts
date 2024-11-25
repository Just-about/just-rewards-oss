import { getAccessTokenCookieSettings } from "@ja-packages/utils/auth/auth";

import type { PlasmoMessaging } from "@plasmohq/messaging";

const BASE_URL = process.env.PLASMO_PUBLIC_SITE_URL || "https://justabout.com";

export type RefreshAccessTokenRequest = {};
export type RefreshAccessTokenResponse = {
  accessToken: string;
} | null;

const handler: PlasmoMessaging.MessageHandler<
  RefreshAccessTokenRequest,
  MessageResponse<RefreshAccessTokenResponse>
> = async (_, res) => {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    cache: "no-store",
    method: "POST",
  });

  const body = await response.json();
  const { accessToken } = body;

  if (!accessToken) {
    res.send({
      error: {
        message: "failed to refresh access token",
        status: 500,
      },
    });
    return;
  }

  const cookieSettings = getAccessTokenCookieSettings(accessToken);

  res.send({
    data: {
      accessToken,
    },
  });
};

export default handler;
