import type { PlasmoMessaging } from "@plasmohq/messaging";

export type GetCookiesRequest = {};
export type GetCookiesResponse = {
  name: string;
  domain: string;
  value: string;
}[];

const handler: PlasmoMessaging.MessageHandler<
  GetCookiesRequest,
  MessageResponse<GetCookiesResponse>
> = async (_, res) => {
  if (!chrome) {
    res.send({
      error: {
        message: "unable to access chrome API",
        status: 500,
      },
    });
  }

  const cookies = await chrome.cookies.getAll({
    domain: process.env.PLASMO_PUBLIC_SITE_DOMAIN,
  });

  res.send({ data: cookies });
};

export default handler;
