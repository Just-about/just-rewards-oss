import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BellRingIconSolid } from "@ja-packages/icons/solid/BellRing";
import { EventType } from "@ja-packages/utils/mixpanel";

import { DismissButton } from "~components/ShadowDOMNotification/DismissButton";
import { ViewButton } from "~components/ShadowDOMNotification/ViewButton";
import { HIDE_FADE_OUT_DURATION } from "~components/consts";
import { trackEvent } from "~utils/fetchers";
import { listTriggeredBounties } from "~utils/fetchers/list-triggered-bounties";
import { getStoredData, setStoredData, STORAGE_KEYS } from "~utils/storage";
import { updateCurrentBounties } from "~utils/update-current-bounties";

import type { SetInterval } from "@ja-packages/utils/timer";

const NOTIFICATION_LIFETIME_SECONDS = 9;
const DISMISSAL_TIMEOUT_MINUTES = 24 * 60;
const DISMISSAL_TIMEOUT = DISMISSAL_TIMEOUT_MINUTES * 60 * 1000;

const getDismissalExpiration = () => {
  const expiration = new Date();
  expiration.setTime(expiration.getTime() + DISMISSAL_TIMEOUT);
  return expiration;
};

type DismissalData = { [url: string]: Date };

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
  const [rewardsAvailable, setRewardsAvailable] = useState<number>(0);

  // We have to wait until the fade out animation has completed before disabling the shadow DOM
  // element is removed from the page. If `animationState` is set to `Hiding`, the notification
  // will begin to fade out.
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.Showing
  );

  const [isHidden, setIsHidden] = useState(true);

  // If we have a passive or active "Dismiss" then that dismissal will be
  // remembered for all URLs that fall under that domain
  const [isDomainOnCooldown, setDomainIsOnCooldown] = useState(false);

  // How long the notification has left until it hides
  const [lifetime, setLifetime] = useState(NOTIFICATION_LIFETIME_SECONDS);
  const lifetimeRef = useRef(NOTIFICATION_LIFETIME_SECONDS);

  const domain = useMemo(
    () => (currentURL ? new URL(currentURL).hostname : ""),
    [currentURL]
  );

  const countdownInterval = useRef<SetInterval>(undefined);

  const hide = useCallback(async () => {
    setAnimationState(AnimationState.Hiding);
    setTimeout(() => {
      setIsHidden(true);
    }, HIDE_FADE_OUT_DURATION * 1000);
  }, [setAnimationState, setIsHidden]);

  const updateDomainCooldown = useCallback(async () => {
    if (!domain) return;
    const expiration = getDismissalExpiration();
    const dismissals = await getStoredData<DismissalData>(
      STORAGE_KEYS.DISMISSED_NOTIFICATION
    );

    const newDismissalData = {
      ...dismissals,
      [domain]: expiration,
    };
    await setStoredData(STORAGE_KEYS.DISMISSED_NOTIFICATION, newDismissalData);
  }, [domain]);

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
      setRewardsAvailable(0);

      await updateCurrentBounties();

      const resp = await listTriggeredBounties({ url });
      const ids = resp.bounties.map((bounty) => bounty.id);
      const dismissals = await getStoredData<DismissalData>(
        STORAGE_KEYS.DISMISSED_NOTIFICATION
      );

      setBountyIDs(ids);
      setRewardsAvailable(resp.rewardsAvailable);

      if (ids.length) {
        await updateCurrentBounties({ ids });

        setAnimationState(AnimationState.Showing);
        setIsHidden(false);

        const isCoolingDown = (() => {
          if (!dismissals) return false;
          if (!domain) return false;
          const timeout = dismissals[domain];
          return timeout && new Date() < new Date(timeout);
        })();

        setDomainIsOnCooldown(isCoolingDown);
        startTimer();
      }
    },
    [setBountyIDs, setDomainIsOnCooldown, domain]
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

  const handleDismissNotificationClick = useCallback(async () => {
    await trackEvent({
      properties: {
        location: "notification-dismissed",
        domain,
      },
      type: EventType.JRX_BUTTON_CLICKED,
    });
    hide();
  }, [hide, domain]);

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

  const doNotDisplay = useMemo(() => {
    // This is included on a separate line to make it easy for debugging and commenting out.
    // prettier-ignore
    // eslint-disable-next-line
    const isCoolingDownOnProduction = isDomainOnCooldown
        && process.env.NODE_ENV === "production";

    return (
      isLoading ||
      isHidden ||
      bountyIDs.length === 0 ||
      isCoolingDownOnProduction
    );
  }, [isLoading, bountyIDs, isHidden, isDomainOnCooldown]);

  // Capture the fact that the notification opened, only once on mount
  useEffect(() => {
    if (doNotDisplay) return;

    trackEvent({
      properties: {
        domain,
      },
      type: EventType.JRX_REWARDS_NOTIFICATION_TRIGGERED,
    });
    updateDomainCooldown();
  }, [doNotDisplay, domain]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  if (doNotDisplay) return null;

  return (
    <div
      className={classNames(
        "min-h-[99px] max-w-[340px] flex items-center fixed top-5 right-5 p-3",
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
          <div className="w-full pr-[24px]">
            <p className="text-xs mb-0 font-['SourceSans3'] opacity-60">
              {domain.replace(/^www\./, "")}
            </p>
            <p className="text-md leading-[19px] font-semibold mb-3 font-['Poppins']">
              {`$${rewardsAvailable} reward${
                bountyIDs.length > 1 ? "s" : ""
              } available`}
            </p>
          </div>

          <div className="flex">
            <ViewButton handleClick={showShadowDOMApp} />
            <DismissButton
              handleClick={handleDismissNotificationClick}
              lifetime={lifetime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
