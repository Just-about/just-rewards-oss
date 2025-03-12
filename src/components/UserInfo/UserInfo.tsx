import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";
import { formatCurrency } from "@ja-packages/utils/format";
import { EventType } from "@ja-packages/utils/mixpanel";
import { convertStringToPrettyHexcode } from "@ja-packages/utils/string-to-color";

import { Button } from "~components/Button";
import { useRouter } from "~components/RouterOutlet";
import { Skeleton } from "~components/Skeleton/Skeleton";
import { trackEvent } from "~utils/fetchers";
import { getUserInfo } from "~utils/fetchers/get-user-info";

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
      const userInfo = await getUserInfo();
      if (!userInfo) {
        setUser(null);
        setBalance(null);
        return;
      }

      setUser(userInfo.user);
      setBalance(
        formatCurrency(userInfo.balance, {
          addCommas: true,
          removeDecimalsWhenInteger: true,
        })
      );
    };

    loadUserDetails().finally(() => setIsLoading(false));

    // Add fade-in effect after 250ms
    const timer = setTimeout(() => setIsVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const handleViewEarnings = useCallback(async () => {
    await trackEvent({
      properties: {
        location: "balance",
      },
      type: EventType.JRX_BUTTON_CLICKED,
    });
    router.openExternalUrl(`${process.env.PLASMO_PUBLIC_SITE_URL}/activity/earnings`);
  }, [router]);

  const handleViewProfile = useCallback(async () => {
    if (!user) return;

    await trackEvent({
      properties: {
        location: "profile",
      },
      type: EventType.JRX_BUTTON_CLICKED,
    });
    router.openExternalUrl(`${process.env.PLASMO_PUBLIC_SITE_URL}/user/${user.username}`);
  }, [router, user]);

  const wrapperClassName = useMemo(
    () =>
      classNames(
        "h-[70px] flex flex-row items-center bg-[#252435] border-t border-white/[0.08] px-5 font-['SourceSans3']",
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
                  className="border border-[#43415F] size-[40px] rounded-[24px] object-cover"
                  src={avatarUrl}
                />
              ) : (
                <div
                  className="aspect-1 max-w-full rounded-full flex items-center justify-center size-[40px]"
                  style={{ backgroundColor: avatarColors?.background }}
                >
                  <span
                    className={classNames("font-['Basic Sans'] font-bold m-auto text-center brightness-75 text-base")}
                    style={{ color: avatarColors?.foreground }}
                  >
                    {initials}
                  </span>
                </div>
              )}
              <div className="pl-3">
                <p className="font-['Basic Sans'] text-lg font-bold text-white mb-0 leading-tight w-[150px] truncate">
                  {user.displayName}
                </p>
                <p className="text-sm text-white/[0.6] mb-0 leading-[130%] w-[150px] truncate">@{user.username}</p>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col items-end justify-center w-1/3 hover:opacity-90 cursor-pointer select-none"
            onClick={handleViewEarnings}
            role="presentation"
            onKeyDown={() => {}}
          >
            <p className="text-min text-right text-white/[0.6] leading-[130%]">My balance</p>
            <p className="text-right">
              <span className="text-2xl leading-tight font-['Basic Sans'] font-bold text-caution-300">$</span>
              <span className="text-2xl leading-tight font-['Basic Sans'] font-bold text-white">{balance || 0}</span>
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
