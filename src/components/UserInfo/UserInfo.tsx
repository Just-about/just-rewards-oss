import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";
import { formatCurrency } from "@ja-packages/utils/format";
import { convertStringToPrettyHexcode } from "@ja-packages/utils/string-to-color";

import { Button } from "~components/Button";
import { useRouter } from "~components/RouterOutlet";
import { Skeleton } from "~components/Skeleton/Skeleton";
import { Tracking } from "~mixpanel";
import { EventType } from "~mixpanel/events";
import { getBalance, getUser } from "~utils/fetchers";
import { STORAGE_KEYS, getStoredData, setStoredData } from "~utils/storage";

import type { UserType } from "@ja-packages/types";

interface UserInfoProps {
  className?: string;
}

export const UserInfo = ({ className }: UserInfoProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>();
  const [balance, setBalance] = useState<string | null>();
  const [isVisible, setIsVisible] = useState(false);

  const userName = useMemo(() => user?.displayName || user?.username, [user]);
  const initials = useMemo(
    () =>
      (userName || "")
        .split(" ")
        .slice(0, 2)
        // Filter out undefined values
        .filter((s) => !!s)
        // Take the first character of each word & uppercase it
        .map((s) => s[0].toUpperCase())
        .join(""),
    [userName]
  );
  const avatarUrl = useMemo(() => user?.avatar?.url, [user]);
  const avatarColors = useMemo(() => {
    if (!userName) return null;
    return {
      background: convertStringToPrettyHexcode(userName, 30),
      foreground: convertStringToPrettyHexcode(userName, -40),
    };
  }, [userName]);

  useEffect(() => {
    const loadUserDetails = async () => {
      // Check if stored data exists
      const storedUser = await getStoredData<UserType>(STORAGE_KEYS.USER_DATA);
      const storedBalance = await getStoredData<string>(
        STORAGE_KEYS.USER_BALANCE
      );

      // Use stored data if it exists
      if (storedUser && storedBalance) {
        setUser(storedUser);
        setBalance(
          formatCurrency(storedBalance, {
            addCommas: true,
            removeDecimalsWhenInteger: true,
          })
        );
      } else {
        // Fetch latest data only if stored data is null
        const latestUser = await getUser();
        const latestBalance = await getBalance();

        // Update state with latest data
        setUser(latestUser);
        if (latestBalance !== null) {
          setBalance(
            formatCurrency(latestBalance, {
              addCommas: true,
              removeDecimalsWhenInteger: true,
            })
          );
        } else {
          setBalance(null);
        }

        // Update storage with latest data
        Promise.allSettled([
          setStoredData(STORAGE_KEYS.USER_DATA, latestUser),
          setStoredData(STORAGE_KEYS.USER_BALANCE, latestBalance),
        ]);
      }
    };

    loadUserDetails().finally(() => setIsLoading(false));

    // Add fade-in effect after 250ms
    const timer = setTimeout(() => setIsVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  // Setup Mixpanel
  const [isMixpanelSetupComplete, setIsMixpanelSetupComplete] = useState(false);
  useEffect(() => {
    if (!user || isMixpanelSetupComplete) return;

    // We only need a simple age calculation for Mixpanel so just minus the years
    const age = user.dob
      ? new Date().getFullYear() - new Date(user.dob).getFullYear()
      : undefined;

    Tracking.identify({ id: user.id, age, staff: Boolean(user.staff) });
    setIsMixpanelSetupComplete(true);
  }, [isMixpanelSetupComplete, user]);

  const handleViewEarnings = useCallback(async () => {
    await Tracking.scheduleTrack(EventType.BUTTON_CLICKED, {
      location: "balance",
    });

    router.openExternalUrl(
      `${process.env.PLASMO_PUBLIC_SITE_URL}/activity/earnings`
    );
  }, [router]);

  const handleViewProfile = useCallback(async () => {
    if (!user) return;

    await Tracking.scheduleTrack(EventType.BUTTON_CLICKED, {
      location: "profile",
    });

    router.openExternalUrl(
      `${process.env.PLASMO_PUBLIC_SITE_URL}/user/${user.username}`
    );
  }, [router, user]);

  const wrapperClassName = useMemo(
    () =>
      classNames(
        "flex flex-row items-center bg-[#252435] border-t border-white/[0.08] px-5 font-['SourceSans3']",
        "transition-opacity duration-300 ease-in",
        {
          "opacity-0": !isVisible,
          "opacity-100": isVisible,
        }
      ),
    [isVisible]
  );

  if (isLoading) {
    return (
      <div className={classNames(wrapperClassName, className)}>
        <div className="flex flex-start items-center w-2/3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="pl-3">
            <Skeleton className="w-32 h-5 mb-1" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-center w-1/3">
          <Skeleton className="w-20 h-3 mb-1" />
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(wrapperClassName, className)}>
      {user ? (
        <>
          <div
            className="flex flex-start items-center w-2/3 hover:opacity-90 cursor-pointer select-none"
            onClick={handleViewProfile}
            role="presentation"
            onKeyDown={() => {}}
          >
            <div className="flex flex-row items-center justify-center">
              {avatarUrl ? (
                <img
                  alt="user avatar"
                  className="rounded-full border border-[#43415F] w-[48px] h-[48px]"
                  src={avatarUrl}
                />
              ) : (
                <div
                  className="aspect-1 max-w-full rounded-full flex items-center justify-center w-[48px] h-[48px]"
                  style={{ backgroundColor: avatarColors?.background }}
                >
                  <span
                    className={classNames(
                      "font-['Poppins'] font-bold m-auto text-center brightness-75 text-md"
                    )}
                    style={{ color: avatarColors?.foreground }}
                  >
                    {initials}
                  </span>
                </div>
              )}
              <div className="pl-3">
                <p className="font-['Poppins'] text-[18px] font-semibold text-white mb-0 leading-tight w-[150px] truncate">
                  {user.displayName}
                </p>
                <p className="text-[16px] text-white/[0.6] mb-0 leading-[130%] font-['SourceSans3'] w-[150px] truncate">
                  @{user.username}
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col items-end justify-center w-1/3 hover:opacity-90 cursor-pointer select-none"
            onClick={handleViewEarnings}
            role="presentation"
            onKeyDown={() => {}}
          >
            <p className="text-[12px] text-right text-white/[0.6] leading-[130%]">
              My balance
            </p>
            <p className="text-right">
              <span className="text-[24px] leading-tight font-['Poppins'] text-[#F8B820] font-[400]">
                $
              </span>
              <span className="text-[26px] leading-tight font-['Poppins'] font-bold text-white">
                {balance || 0}
              </span>
            </p>
          </div>
        </>
      ) : (
        <Button
          className="grow md:px-8"
          color="purple"
          href={`${process.env.PLASMO_PUBLIC_SITE_URL}/join?jrx=true`}
          iconLeft={CircleRightArrowSolid}
        >
          Join now
        </Button>
      )}
    </div>
  );
};
