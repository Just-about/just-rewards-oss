import { useEffect, useState } from "react";

import { App, AppWrapper } from "~components/App/App";
import { getAppRouteEntrypoint } from "~components/App/getAppRouteEntrypoint";
import { LoadingSpinner } from "~components/LoadingSpinner/LoadingSpinner";
import { RouterProvider } from "~components/RouterOutlet";
import { ROUTES } from "~components/routes";
import { updateCurrentBounties } from "~utils/update-current-bounties";

import "./style.css";

/**
 * Handles what appears when clicking the extension icon in the browser toolbar
 */
const ExtensionPopup = () => {
  const [entrypoint, setEntrypoint] = useState<string[] | undefined>(undefined);

  // No extension close event exists. To recreate one, we instead send a heartbeat every 3 seconds when the popup is
  // open. The shadow DOM will be able to detect when the popup is closed when it doesn't receive a message.
  useEffect(() => {
    let tabID: number | undefined;
    chrome.tabs.query({ active: true, currentWindow: true }, (chromeTabs) => {
      if (chromeTabs.length < 1) return;

      tabID = chromeTabs[0].id;
      if (!tabID) return;

      chrome.tabs.sendMessage(tabID, { action: "popup_open" });
    });

    setInterval(() => {
      if (!tabID) return;
      chrome.tabs.sendMessage(tabID, { action: "popup_open" });
    }, 3000);
  }, []);

  useEffect(() => {
    getAppRouteEntrypoint().then((e) => setEntrypoint(e));
  }, []);

  // Remove any badge notifications and prevent a reroute to the current bounty on the next extension open
  useEffect(() => {
    if (!entrypoint) return;
    updateCurrentBounties();
  }, [entrypoint]);

  if (!entrypoint)
    return (
      <AppWrapper className="flex items-center justify-center">
        <LoadingSpinner />
      </AppWrapper>
    );

  return (
    <RouterProvider routes={ROUTES} entrypoint={entrypoint}>
      <App className="slide-up-animation" />
    </RouterProvider>
  );
};

export default ExtensionPopup;
