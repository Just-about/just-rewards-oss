import type { PlasmoMessaging } from "@plasmohq/messaging";

export type OpenSubmitFormRequest = {
  bountyType: "text" | "video" | "image" | "link";
  screenWidth: number;
};

export type OpenSubmitFormResponse = MessageResponse<string>;

const handler: PlasmoMessaging.MessageHandler<
  OpenSubmitFormRequest,
  OpenSubmitFormResponse
> = async (req, res) => {
  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to OpenSubmitForm",
        status: 400,
      },
    });
    return;
  }

  // Get screen dimensions
  const { screenWidth } = req.body;
  const type = req.body.bountyType;

  // Define the popup dimensions
  const width = 670;
  const height = ["image", "video"].includes(type) ? 750 : 550;

  // Calculate top and left positions to center the popup
  const left = Math.ceil(Math.max(0, (screenWidth - width) / 2));
  const top = 200;

  chrome.windows.create({
    url: `tabs/submit.html?type=${type}`,
    type: "popup",
    width,
    height,
    top,
    left,
  });

  res.send({ data: "" });
};

export default handler;
