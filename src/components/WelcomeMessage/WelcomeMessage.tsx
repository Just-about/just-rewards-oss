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

    router.openExternalUrl("https://justabout.com");
  }, [router]);

  return (
    <div className="pt-2 px-5 pb-4 dark">
      <h1 className="font-['Basic Sans'] font-bold text-3xl leading-[26px] -tracking-[2%] text-white mb-2">
        Discover rewards wherever you are
      </h1>

      <p
        data-testid="welcome-message"
        className="font-['SourceSans3'] text-base leading-[19.2px] text-neutral-400 mb-4"
      >
        Share your knowledge, skills and
        <br /> passion to earn rewards everywhere
      </p>

      <Button size="md" color="purple" onClick={handleViewAllRewards} iconLeft={CircleRightArrowSolid}>
        Discover rewards
      </Button>
    </div>
  );
};
