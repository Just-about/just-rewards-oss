import type { PlasmoMessaging } from "@plasmohq/messaging";

export type DeleteTokensRequest = {};
export type DeleteTokensResponse = {
  success: boolean;
};

const BASE_URL = process.env.PLASMO_PUBLIC_SITE_URL;

const handler: PlasmoMessaging.MessageHandler<DeleteTokensRequest, MessageResponse<DeleteTokensResponse>> = async (
  _,
  res
) => {
  const response = await fetch(`${BASE_URL}/auth/sign-out`);

  res.send({
    data: {
      success: response.ok,
    },
  });
};

export default handler;
