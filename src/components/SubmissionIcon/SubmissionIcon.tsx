import classNames from "classnames";

import type { JAIcon } from "@ja-packages/icons/types";

interface SubmissionIconProps {
  backgroundHex: `#${string}`;
  icon: JAIcon;
  iconClassName?: string;
}

export const SubmissionIcon = ({ backgroundHex, iconClassName, icon: Icon }: SubmissionIconProps) => {
  return (
    <div
      className={classNames(
        "flex flex-shrink-0 items-center justify-center w-[36px] h-[36px] rounded-full",
        "!text-white"
      )}
      style={{
        backgroundColor: backgroundHex,
      }}
    >
      <Icon className={classNames("w-[18px] h-auto", iconClassName)} />
    </div>
  );
};
