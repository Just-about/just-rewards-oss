import classNames from "classnames";
// eslint-disable-next-line import/no-unresolved
import logo from "data-url:./logo.png";
import { useCallback } from "react";

import { XMarkIconRegular } from "@ja-packages/icons/regular/XMark";
import { BellIconSolid } from "@ja-packages/icons/solid/Bell";

import { useRouter } from "~components/RouterOutlet";
import { Tracking } from "~mixpanel";
import { EventType } from "~mixpanel/events";

interface HeaderProps {
  onClose?: () => void;
}

export const Header = ({ onClose }: HeaderProps) => {
  const router = useRouter();

  const handleClickNotifications = useCallback(async () => {
    await Tracking.scheduleTrack(EventType.BUTTON_CLICKED, {
      location: "notifications",
    });

    router.openExternalUrl(`${process.env.PLASMO_PUBLIC_SITE_URL}/activity`);
  }, [router]);

  return (
    <div
      className={classNames(
        "bg-[#16151F] flex flex-row items-center justify-between",
        "pt-3 pb-2 px-5"
      )}
    >
      <img
        alt="just about logo"
        className="h-[30px] w-auto relative -left-[4px] top-[2px] hover:cursor-pointer"
        src={logo}
        onClick={() =>
          // Scroll to the index page, keeping the history whilst we scroll back to the 0th page
          router
            .navigate(["/", ...router.history], 0)
            // Clear the history
            .then(() => router.navigate(["/"]))
        }
        role="presentation"
      />

      <div className="flex justify-end items-center space-x-4">
        <BellIconSolid
          onClick={handleClickNotifications}
          className="h-[16px] text-[#43415F] cursor-pointer hover:opacity-90"
        />

        <XMarkIconRegular
          className="cursor-pointer text-white h-[20px] w-auto hover:opacity-90"
          onClick={onClose || window.close}
        />
      </div>
    </div>
  );
};
