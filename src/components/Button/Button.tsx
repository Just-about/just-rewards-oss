import classNames from "classnames";
import { useCallback, type PropsWithChildren } from "react";

import type { JAIcon } from "@ja-packages/icons/types";

type ButtonProps = {
  color: "white" | "purple" | "light-purple" | "grey";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
  href?: string;
  iconLeft?: JAIcon;
  isDisabled?: boolean;
} & PropsWithChildren;

const ButtonWrapper = (props: Pick<ButtonProps, "href" | "children">) => {
  if (props.href)
    return (
      <a href={props.href} target="_blank" rel="noreferrer">
        {props.children}
      </a>
    );

  return props.children;
};

export const Button = ({
  color,
  children,
  className,
  onClick,
  size = "md",
  href,
  iconLeft: IconLeft,
  isDisabled,
}: ButtonProps) => {
  const colors: Record<ButtonProps["color"], { button: string; text: string }> =
    {
      "light-purple": {
        button: "bg-[#9849f5] hover:bg-[#9045e6] border-2 border-transparent",
        text: "text-white",
      },
      purple: {
        button:
          "bg-ja-purple-600 hover:bg-ja-purple-800 focus::bg-ja-purple-800 border-2 border-white",
        text: "text-white",
      },
      grey: {
        button: "bg-[#32313a] hover:bg-[#2a2930] border-2 border-transparent",
        text: "text-white",
      },
      white: {
        button: "bg-white hover:bg-white/80 border-2 border-transparent",
        text: "text-[#16151F]",
      },
    };

  const dimensions: Record<
    Exclude<ButtonProps["size"], undefined>,
    { button: string; text: string }
  > = {
    sm: {
      button: "",
      text: "text-xs leading-[18px]",
    },
    md: {
      button: "h-[41px] px-5",
      text: "text-[14px] leading-[21px]",
    },
  };

  const handleClick = useCallback(() => {
    if (isDisabled) return;

    onClick?.();
  }, [onClick, isDisabled]);

  return (
    <ButtonWrapper href={isDisabled ? undefined : href}>
      <button
        onClick={handleClick}
        className={classNames(
          "rounded-full py-2 px-5 flex items-center justify-center cursor-pointer transition-colors",
          colors[color].button,
          dimensions[size].button,
          className,
          { "cursor-not-allowed opacity-50": isDisabled }
        )}
        type="button"
      >
        <span
          className={classNames(
            colors[color].text,
            dimensions[size].text,
            "font-semibold flex gap-2 items-center justify-center font-['Poppins']"
          )}
        >
          {IconLeft && <IconLeft />}
          {children}
        </span>
      </button>
    </ButtonWrapper>
  );
};
