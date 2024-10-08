import classNames from "classnames";
import { useMemo, type FC } from "react";
import Route from "route-parser";

import { Button } from "~components/Button";

import { ANIMATION_DURATION } from "./consts";
import { Routes, useRouter } from "./context";

const containerClasses = "h-full w-[340px] min-w-[340px]";

export type RouterOutletProps = {
  routes: Routes;
  entrypoint?: string[];
  children: React.ReactNode;
};

export const NotFound = ({ children }: { children: React.ReactNode }) => (
  <div className={classNames(containerClasses, "mb-4 p-5")}>
    <p className="text-white text-lg">Not Found: {children}</p>
  </div>
);

export const RouterOutlet = () => {
  const { cursor, history, routes, pop, push } = useRouter();

  const matchers: Array<[route: Route, component: FC]> = useMemo(
    () =>
      Object.entries(routes).map(([route, component]) => [
        new Route(route),
        component,
      ]),
    [routes]
  );

  const debug = false;
  return (
    <>
      {debug && (
        <>
          <p className="!text-white">
            cursor: {cursor} {history[cursor]} - history:
            {JSON.stringify(history)}
          </p>

          <div className="flex gap-2">
            <Button color="purple" onClick={pop} size="sm">
              Pop
            </Button>

            <Button
              color="purple"
              onClick={() => push("/bounties/list/1,2,3")}
              size="sm"
            >
              /bounties/list/1
            </Button>

            <Button
              color="purple"
              onClick={() => push("/bounties/list/2")}
              size="sm"
            >
              /bounties/list/1,2,3
            </Button>
          </div>
        </>
      )}

      <div
        style={{
          transitionDuration: `${ANIMATION_DURATION}ms`,
          transform: `translate(-${cursor * 100}%)`,
        }}
        className={classNames("flex w-full h-full transition-transform")}
      >
        {history.map((path) => {
          for (let i = 0; i < matchers.length; i += 1) {
            const [route, Component] = matchers[i];

            const match = route.match(path);

            // This allows passing a comma separated list in the path variables
            const convertedMatch = match
              ? Object.fromEntries(
                  Object.entries(match).map(([key, value]) => {
                    const splitValue = value.split(",");
                    return splitValue.length > 1
                      ? [key, splitValue]
                      : [key, value];
                  })
                )
              : false;

            if (match)
              return (
                <div className={containerClasses} key={path}>
                  {/* Pass the route parameters matched from the URL into the component */}
                  {/* /bounties/:bountyId --> { bountyId: 123 } */}
                  <Component {...convertedMatch} />
                </div>
              );
          }

          return <NotFound key={path}>{path}</NotFound>;
        })}
      </div>
    </>
  );
};
