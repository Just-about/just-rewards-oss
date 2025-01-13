import classNames from "classnames";
import { useCallback, useState } from "react";

import { App } from "~components/App";
import { HIDE_FADE_OUT_DURATION } from "~components/consts";

/**
 * Handles rendering the app, the same as in `popup.tsx`, but within the ShadowDOM
 * injected on-top of the page content
 * */
export const ShadowDOMApp = ({ closeApp }: { closeApp: () => void }) => {
  const [isHiding, setIsHiding] = useState(false);

  const hideApp = useCallback(async () => {
    setIsHiding(true);

    setTimeout(() => {
      closeApp();
    }, HIDE_FADE_OUT_DURATION * 1000);
  }, []);

  return (
    <div
      className={classNames(
        isHiding ? "fade-out-animation" : "slide-up-animation",
        "fixed top-5 right-5 rounded-xl overflow-hidden"
      )}
    >
      <App onClose={hideApp} />
    </div>
  );
};
