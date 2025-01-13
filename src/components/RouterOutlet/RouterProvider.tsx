import { useCallback, useMemo, useState } from "react";

import { RouterOutletProps } from "./RouterOutlet";
import { ANIMATION_DURATION } from "./consts";
import { RouterContext } from "./context";

export const RouterProvider = ({ routes, children, entrypoint }: RouterOutletProps) => {
  const [history, setHistory] = useState<string[]>(entrypoint || ["/"]);
  const [cursor, setCursor] = useState<number>(entrypoint ? entrypoint.length - 1 : 0);

  const push = useCallback(
    (path: string) => {
      setHistory([...history, path]);
      setCursor(cursor + 1);
    },
    [history, cursor]
  );

  const pop = useCallback(() => {
    // Can't go any further than root
    if (cursor === 0) return;

    setCursor(cursor - 1);

    // Remove the history item after animation completed
    setTimeout(() => {
      setHistory(history.slice(0, -1));
    }, ANIMATION_DURATION);
  }, [history, cursor]);

  const navigate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (paths: string[], cursor?: number) => {
      return new Promise<void>((res) => {
        const uniquePaths = paths.filter((item, idx, arr) => arr.indexOf(item) === idx);

        // Overwrite the history
        setHistory(uniquePaths);
        setCursor(cursor ?? uniquePaths.length - 1);

        setTimeout(res, ANIMATION_DURATION);
      });
    },
    [history, cursor]
  );

  const openExternalUrl = useCallback((url: string) => window.open(`${url}?referrer=jrx`, "_blank"), [window]);

  const contextState = useMemo(
    () => ({
      push,
      pop,
      cursor,
      history,
      navigate,
      routes,
      openExternalUrl,
    }),
    [push, pop, cursor, history, navigate, routes, openExternalUrl]
  );

  return <RouterContext.Provider value={contextState}>{children}</RouterContext.Provider>;
};
