import classNames from "classnames";
// eslint-disable-next-line import/no-unresolved
import logo from "data-url:./logo.png";
import { useCallback } from "react";

import { XMarkIconRegular } from "@ja-packages/icons/regular/XMark";
import { BellIconSolid } from "@ja-packages/icons/solid/Bell";
import { EventType } from "@ja-packages/utils/mixpanel";

import { useRouter } from "~components/RouterOutlet";
import { trackEvent } from "~utils/fetchers";

interface HeaderProps {
  onClose?: () => void;
}

export const Header = ({ onClose }: HeaderProps) => {
  const router = useRouter();

  const handleClickNotifications = useCallback(async () => {
    await trackEvent({
      properties: {
        location: "notifications",
      },
      type: EventType.JRX_BUTTON_CLICKED,
    });
    router.openExternalUrl(`${process.env.PLASMO_PUBLIC_SITE_URL}/activity`);
  }, [router]);

  return (
    <div className={classNames("bg-[#16151F] flex flex-row items-center justify-between", "py-[20px] px-5")}>
      <img
        alt="just about logo"
        className="h-[22px] w-auto relative hover:cursor-pointer"
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
          className="h-[20px] text-neutral-600 cursor-pointer hover:opacity-90"
        />

        <XMarkIconRegular
          className="cursor-pointer text-white h-[20px] w-auto hover:opacity-90 font-[900]"
          onClick={onClose || window.close}
        />
      </div>
    </div>
  );
};
