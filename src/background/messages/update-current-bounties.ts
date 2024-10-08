import { STORAGE_KEYS, setStoredData } from "~utils/storage";

import type { PlasmoMessaging } from "@plasmohq/messaging";

export type UpdateCurrentBountiesRequest = {
  ids: number[] | undefined;
};

export type UpdateCurrentBountiesResponse = string;

const handler: PlasmoMessaging.MessageHandler<
  UpdateCurrentBountiesRequest,
  MessageResponse<UpdateCurrentBountiesResponse>
> = async (req, res) => {
  if (!chrome) {
    res.send({
      error: {
        message: "unable to access chrome API",
        status: 500,
      },
    });
  }

  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to UpdateCurrentBounties",
        status: 400,
      },
    });
    return;
  }

  // store the current bounty, so it can be accessed by the extension popup
  await setStoredData(
    STORAGE_KEYS.CURRENT_BOUNTIES,
    req.body.ids ? req.body.ids.join(",") : ""
  );

  const tabId = await chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((r) => r[0].id);

  if (tabId) {
    // set notification badge
    const text = req.body.ids ? String(req.body.ids.length) : "";
    await chrome.action.setBadgeBackgroundColor({ color: "#FD521B", tabId });
    await chrome.action.setBadgeTextColor({ color: "#FFFFFF", tabId });
    await chrome.action.setBadgeText({ text, tabId });
  }

  res.send({ data: "" });
};

export default handler;
