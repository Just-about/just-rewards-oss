import { useCallback, useEffect, useRef, useState } from "react";

import { EventType } from "@ja-packages/utils/mixpanel";

import { RouterProvider, useRouter } from "~components/RouterOutlet";
import { ShadowDOMApp } from "~components/ShadowDOMApp";
import { ShadowDOMNotification } from "~components/ShadowDOMNotification";
import { ROUTES } from "~components/routes";
import { Tracking } from "~mixpanel";
import { getTailwind } from "~utils/get-tailwind";

import type { SetInterval, SetTimeout } from "@ja-packages/utils/timer";
import type { PlasmoCSConfig } from "plasmo";

export const getStyle = getTailwind;

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  css: ["font.css"],
};

/* The main entrypoint for the application, ShadowDOM handles what is displayed, overlaid on top
 * of the page content - use `viewState` to dictate what should be rendered */
const ShadowDOM = () => {
  const router = useRouter();

  const [viewState, setViewState] = useState<"notification" | "app">(
    "notification"
  );
  const [isShadowDOMHidden, setIsShadowDOMHidden] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const showNotificationTimeoutRef = useRef<SetTimeout>(undefined);
  // Delay showing the notification until 2 seconds has passed
  useEffect(() => {
    showNotificationTimeoutRef.current = setTimeout(() => {
      setIsShadowDOMHidden(false);
    }, 2e3);

    return () => clearTimeout(showNotificationTimeoutRef.current);
  }, []);

  const lastMessageReceived = useRef(Date.now());
  const lastMessageTrackerRef = useRef<SetInterval>(undefined);

  // if a visibility message hasn't been received for 10 seconds then we can assume it is closed
  useEffect(() => {
    lastMessageTrackerRef.current = setInterval(() => {
      if (Date.now() > lastMessageReceived.current + 10000) {
        setIsPopupOpen(false);
      }
    }, 5000);
  }, []);

  // Open the Shadow DOM version of the app if user is on Just About
  // and `open-just-rewards` query string is 'true'
  useEffect(() => {
    const openJustRewards = async () => {
      const siteUrl = process.env.PLASMO_PUBLIC_SITE_URL;
      const { protocol, host, search } = window.location;
      if (siteUrl !== `${protocol}//${host}`) {
        return;
      }

      const searchParams = new URLSearchParams(search);
      if (searchParams.get("open-just-rewards") === "true") {
        setViewState("app");
        setIsShadowDOMHidden(false);
      }
    };

    openJustRewards();
  }, [setViewState, setIsShadowDOMHidden]);

  // clear up timer
  useEffect(() => () => clearInterval(lastMessageTrackerRef.current), []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "popup_open") {
        lastMessageReceived.current = Date.now();
        setIsPopupOpen(true);
        clearTimeout(showNotificationTimeoutRef.current);
      }
    });
  }, []);

  const [currentURL, setCurrentURL] = useState<string | null>(null);
  const currentURLRef = useRef<string | null>(null);

  const domain = currentURL ? new URL(currentURL).hostname : "";

  const locationCheckTimer = useRef<SetInterval>(undefined);

  // Location change listeners are not well covered across browsers. Rather than have some browsers work
  // and others not. We instead poll the current window to check for the URL.
  useEffect(() => {
    const checkNewURL = () => {
      if (currentURLRef.current !== window.location.href) {
        setCurrentURL(window.location.href);
        currentURLRef.current = window.location.href;
      }
    };

    clearInterval(locationCheckTimer.current);
    checkNewURL();

    locationCheckTimer.current = setInterval(() => {
      checkNewURL();
    }, 2500);
  }, []);

  useEffect(() => () => clearInterval(locationCheckTimer.current), []);

  const handleOpenViewBountyClick = useCallback(
    (bountyIDs: number[]) => {
      if (bountyIDs.length === 0) return;

      setViewState("app");

      Tracking.trackEvent({
        eventType: EventType.REWARDS_NOTIFICATION_VIEW_REWARDS_BUTTON_CLICKED,
        eventProperties: {
          domain,
        },
      });

      if (bountyIDs.length > 1) {
        router.push(`/bounties/list/${bountyIDs.join(",")}`);
      } else {
        const bountyID = bountyIDs[0];

        router.push(`/bounties/${bountyID}`);
      }
    },

    [router, domain]
  );

  if (isShadowDOMHidden || isPopupOpen) return null;

  return (
    <div className="fixed top-5 right-5 visible">
      {viewState === "notification" && (
        <ShadowDOMNotification
          currentURL={currentURL}
          openBountyDetails={handleOpenViewBountyClick}
        />
      )}

      {viewState === "app" && (
        <ShadowDOMApp closeApp={() => setIsShadowDOMHidden(true)} />
      )}
    </div>
  );
};

// eslint-disable-next-line react/function-component-definition
export default function () {
  return (
    <RouterProvider routes={ROUTES}>
      <ShadowDOM />
    </RouterProvider>
  );
}
