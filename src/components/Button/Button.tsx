import classNames from "classnames";
import { useCallback, type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import type { JAIcon } from "@ja-packages/icons/types";

type ButtonProps = {
  color: "white" | "purple" | "light-purple" | "grey";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
  href?: string;
  iconClassName?: string;
  iconLeft?: JAIcon;
  isDisabled?: boolean;
  ghost?: boolean;
} & PropsWithChildren;

const ButtonWrapper = (props: Pick<ButtonProps, "href" | "children" | "className">) => {
  if (props.href)
    return (
      <a href={props.href} target="_blank" rel="noreferrer" className={props.className}>
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
  iconClassName,
  isDisabled,
  ghost,
}: ButtonProps) => {
  const colors: Record<ButtonProps["color"], { button: string; text: string; icon?: string }> = {
    "light-purple": {
      button: ghost
        ? "border-2 border-[#B882F8] group-hover/button:border-[#986ccd]"
        : "bg-[#9849f5] hover:bg-[#9045e6] border-2 border-transparent",
      text: "text-white",
      icon: ghost ? "text-[#B882F8] group-hover/button:opacity-80" : "",
    },
    purple: {
      button: "bg-[#6D22C5] hover:bg-[#6D22C5] focus::bg-[#5A19A7]",
      text: "text-[#E7E6E9]",
    },
    grey: {
      button: "bg-[#252435] hover:bg-[#2a2930]",
      text: "text-[#E7E6E9]",
    },
    white: {
      button: "bg-white hover:bg-white/80 border-2 border-transparent",
      text: "text-[#16151F]",
    },
  };

  const dimensions: Record<Exclude<ButtonProps["size"], undefined>, { button: string; text: string }> = {
    sm: {
      button: "rounded-xl py-[12px] px-[16px]",
      text: "text-base leading-none font-semibold",
    },
    md: {
      button: "h-[40px] px-[16px]",
      text: "text-[15px] leading-[21px]",
    },
  };

  const handleClick = useCallback(() => {
    if (isDisabled) return;

    onClick?.();
  }, [onClick, isDisabled]);

  return (
    <ButtonWrapper href={isDisabled ? undefined : href} className="group/button">
      <button
        onClick={handleClick}
        className={twMerge(
          "rounded-[16px] py-2 px-5 flex items-center justify-center cursor-pointer transition-colors",
          classNames({ "cursor-not-allowed opacity-50": isDisabled }),
          colors[color].button,
          dimensions[size].button,
          className
        )}
        type="button"
      >
        <span
          className={twMerge(
            colors[color].text,
            dimensions[size].text,
            "font-semibold flex gap-2 items-center justify-center font-display"
          )}
        >
          {IconLeft && <IconLeft className={classNames("transition-colors", colors[color].icon)} />}
          {children}
        </span>
      </button>
    </ButtonWrapper>
  );
};
