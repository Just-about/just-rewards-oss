import { useCallback } from "react";

import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";
import { EventType } from "@ja-packages/utils/mixpanel";

import { Button } from "~components/Button";
import { useRouter } from "~components/RouterOutlet";
import { trackEvent } from "~utils/fetchers";

export const WelcomeMessage = () => {
  const router = useRouter();

  const handleViewAllRewards = useCallback(async () => {
    await trackEvent({
      properties: {
        location: "view-all-rewards",
      },
      type: EventType.JRX_BUTTON_CLICKED,
    });
    router.openExternalUrl(
      "https://justabout.com/?tag=bounty&tag=platform-rewards"
    );
  }, [router]);

  return (
    <div className="pt-2 px-5 pb-4">
      <h1 className="font-['Poppins'] font-semibold text-[24px] leading-[120%] -tracking-[2%] text-white mb-2">
        A new way to
        <br /> create and earn
      </h1>

      <p
        data-testid="welcome-message"
        className="font-['SourceSans3'] text-[16px] leading-[120%] text-white mb-4"
      >
        Share your knowledge, skills and passion to get your just rewards!
      </p>

      <Button
        size="md"
        color="purple"
        onClick={handleViewAllRewards}
        iconLeft={CircleRightArrowSolid}
      >
        View all rewards
      </Button>
    </div>
  );
};
