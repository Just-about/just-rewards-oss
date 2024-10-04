import classNames from "classnames";
import { CSSProperties } from "react";

export const Skeleton = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    className={classNames("animate-pulse bg-gray-700 rounded", className)}
    style={style}
  />
);
