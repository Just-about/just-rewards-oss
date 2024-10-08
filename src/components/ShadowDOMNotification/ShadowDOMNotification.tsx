import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BellRingIconSolid } from "@ja-packages/icons/solid/BellRing";
import { XMarkIconSolid } from "@ja-packages/icons/solid/XMark";

import { Button } from "~components/Button/Button";
import { HIDE_FADE_OUT_DURATION } from "~components/consts";
import { Tracking } from "~mixpanel";
import { EventType } from "~mixpanel/events";
import { listBounties } from "~utils/fetchers/list-bounties";
import { listTriggerUrls } from "~utils/fetchers/list-trigger-urls";
import { STORAGE_KEYS, setStoredData, getStoredData } from "~utils/storage";
import { updateCurrentBounties } from "~utils/update-current-bounties";

import type { JrxTriggerUrl } from "@ja-packages/types/jarb";
import type { SetInterval } from "@ja-packages/utils/timer";

const NOTIFICATION_LIFETIME_SECONDS = 9;
const DISMISSAL_TIMEOUT_MINUTES = 5;
const DISMISSAL_TIMEOUT = DISMISSAL_TIMEOUT_MINUTES * 60 * 1000;

const getDismissalExpiration = () => {
  const expiration = new Date();
  expiration.setTime(expiration.getTime() + DISMISSAL_TIMEOUT);
  return expiration;
};

type DismissalData = { [id: number]: Date };

enum AnimationState {
  Hiding = "hiding",
  Showing = "showing",
}

interface ShadowDOMNotificationProps {
  currentURL: string | null;
  openBountyDetails: (bountyIDs: number[]) => void;
}

export const ShadowDOMNotification = ({
  currentURL,
  openBountyDetails,
}: ShadowDOMNotificationProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bountyIDs, setBountyIDs] = useState<number[]>([]);
  const [triggerURLs, setTriggerURLs] = useState<JrxTriggerUrl[]>([]);
  const [dismissalData, setDismissalData] = useState<DismissalData | null>(
    null
  );

  // We have to wait until the fade out animation has completed before disabling the shadow DOM
  // element is removed from the page. If `animationState` is set to `Hiding`, the notification
  // will begin to fade out.
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.Showing
  );

  const [isHidden, setIsHidden] = useState(true);

  // If the user has hit "Dismiss" then that dismissal will be remembered for all URLs associated with
  // bounties that appear on this page. Dismissed URLs will not be displayed.
  const [isDismissedForURL, setIsDismissedForURL] = useState(false);

  // How long the notification has left until it hides
  const [lifetime, setLifetime] = useState(NOTIFICATION_LIFETIME_SECONDS);
  const lifetimeRef = useRef(NOTIFICATION_LIFETIME_SECONDS);

  const countdownInterval = useRef<SetInterval>(undefined);

  const hide = useCallback(async () => {
    setAnimationState(AnimationState.Hiding);
    setTimeout(() => {
      setIsHidden(true);
    }, HIDE_FADE_OUT_DURATION * 1000);
  }, [setAnimationState, setIsHidden]);

  const stopTimer = useCallback(() => {
    clearInterval(countdownInterval.current);
  }, [countdownInterval]);

  const startTimer = useCallback(() => {
    countdownInterval.current = setInterval(() => {
      lifetimeRef.current -= 1;
      setLifetime(lifetimeRef.current);

      if (lifetimeRef.current === 0) {
        hide();
        stopTimer();
      }
    }, 1000);
  }, [countdownInterval, setLifetime, hide, stopTimer]);

  const loadData = useCallback(
    async (url: string) => {
      lifetimeRef.current = NOTIFICATION_LIFETIME_SECONDS;
      setLifetime(NOTIFICATION_LIFETIME_SECONDS);
      setBountyIDs([]);

      await updateCurrentBounties();

      const bounties = await listBounties({ url });
      const ids = bounties.map((bounty) => bounty.id);
      const dismissals = await getStoredData<DismissalData>(
        STORAGE_KEYS.DISMISSED_NOTIFICATION
      );

      setBountyIDs(ids);
      setDismissalData(dismissals || {});

      if (!ids.length) {
        setTriggerURLs([]);
      } else {
        await updateCurrentBounties({ ids });
        const urls = await listTriggerUrls({ bountyIDs: ids });
        setTriggerURLs(urls);
        const urlIDs = urls.map((u) => u.id);
        const isDismissed = Object.entries(dismissals || {}).some(
          ([id, timeout]) =>
            urlIDs.includes(Number(id)) && new Date() < new Date(timeout)
        );
        setAnimationState(AnimationState.Showing);
        setIsHidden(false);
        setIsDismissedForURL(isDismissed);
        startTimer();
      }
    },
    [setBountyIDs, setTriggerURLs, setDismissalData, setIsDismissedForURL]
  );

  const notifyChangeInCurrentBounties = useCallback(
    (ids: number[]) =>
      updateCurrentBounties({ ids: ids?.length ? ids : undefined }),
    [currentURL]
  );

  const setup = useCallback(async () => {
    if (!currentURL) return;
    clearInterval(countdownInterval.current);
    stopTimer();
    await loadData(currentURL);
    setIsLoading(false);
  }, [currentURL, loadData, setIsLoading]);

  const showShadowDOMApp = useCallback(async () => {
    // Do these at the same time, so they fade-in-out together
    hide();
    openBountyDetails(bountyIDs);
  }, [hide, bountyIDs]);

  const setDismissed = useCallback(() => {
    setIsDismissedForURL(true);
    const expiration = getDismissalExpiration();
    const newDismissalData = {
      ...dismissalData,
      ...Object.fromEntries(
        triggerURLs.map((triggerURL) => [triggerURL.id, expiration])
      ),
    };
    setStoredData(STORAGE_KEYS.DISMISSED_NOTIFICATION, newDismissalData);
  }, [setIsDismissedForURL, dismissalData, triggerURLs]);

  const handleDismissNotificationClick = useCallback(() => {
    Tracking.trackEvent(EventType.BUTTON_CLICKED, {
      location: "notification-dismissed",
    });
    setDismissed();
    hide();
  }, [hide, setDismissed]);

  // Update the bounties & count in the app/badge whenever the bountyIDs change
  useEffect(() => {
    notifyChangeInCurrentBounties(bountyIDs);
  }, [bountyIDs, notifyChangeInCurrentBounties]);

  // Listen for when the user changes which tab is being viewed, and pause/start the timer
  // if/when they're viewing the tab with an active countdown
  useEffect(() => {
    const listener = () => {
      if (document.hidden) {
        // Page is not visible, stop the timer
        stopTimer();
      } else {
        // Page is visible again, restart the timer
        startTimer();
        notifyChangeInCurrentBounties(bountyIDs);
      }
    };

    document.addEventListener("visibilitychange", listener);
    return () => document.removeEventListener("visibilitychange", listener);
  }, [stopTimer, startTimer, bountyIDs, notifyChangeInCurrentBounties]);

  useEffect(() => {
    setup();
  }, [currentURL, loadData, setIsLoading]);

  // Capture the fact that the notification opened, only once on mount
  useEffect(() => {
    Tracking.trackEvent(EventType.REWARDS_NOTIFICATIONS_TRIGGERED, {});
  }, []);

  const doNotDisplay = useMemo(
    // Disabling ESlint to make it easy to comment out env check for testing
    /* eslint-disable */
    () => {
      return (
        isLoading ||
        isHidden ||
        bountyIDs.length === 0 ||
        (
          isDismissedForURL
          && process.env.NODE_ENV === "production"
        )
      )
    },
    /* eslint-enable */
    [isLoading, bountyIDs, isHidden, isDismissedForURL]
  );

  useEffect(() => () => stopTimer(), [stopTimer]);

  if (doNotDisplay) return null;

  return (
    <div
      className={classNames(
        "h-[99px] flex items-center fixed top-5 right-5",
        animationState === AnimationState.Hiding
          ? "fade-out-animation"
          : "slide-up-animation",
        "flex px-4 bg-[#8A30F4]",
        "rounded-2xl text-white shadow-2xl"
      )}
    >
      <div className="flex flex-row">
        <div className="bg-white/80 min-w-8 max-w-8 min-h-8 max-h-8 flex items-center justify-center rounded-lg mr-3">
          <BellRingIconSolid
            style={{ color: "#8A30F4", height: "16px" }}
            className="rotate-12"
          />
        </div>

        <div className="flex flex-col relative">
          <XMarkIconSolid
            onClick={handleDismissNotificationClick}
            className="absolute right-0 top-0 cursor-pointer opacity-90 h-[20px]"
          />

          <p className="text-sm leading-[21px] font-semibold mb-3 font-['Poppins']">
            Rewards available
          </p>

          <div className="flex">
            <Button
              size="sm"
              color="white"
              className="mr-2"
              onClick={showShadowDOMApp}
            >
              View rewards
            </Button>

            <Button
              size="sm"
              color="light-purple"
              onClick={handleDismissNotificationClick}
            >
              <span>
                Dismiss{" "}
                <span className="font-light font-['SourceCode']">
                  ({lifetime})
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
