import { twMerge } from "tailwind-merge";

import { ArrowRightIconSolid } from "@ja-packages/icons/solid/ArrowRight";

interface DismissButtonProps {
  handleClick: () => void;
  lifetime: number;
}

export const DismissButton = ({
  handleClick,
  lifetime,
}: DismissButtonProps) => (
  <button
    onClick={handleClick}
    className={twMerge(
      "rounded-[6px] px-[12px] py-[6px]",
      "flex items-center justify-center cursor-pointer transition-colors",
      "bg-ja-purple-600 hover:bg-ja-purple-800 focus::bg-ja-purple-800 border-2 border-white"
    )}
    type="button"
  >
    <span
      className={twMerge(
        "text-white",
        "text-xs font-semibold font-['Poppins']",
        "flex items-center justify-center"
      )}
    >
      Dismiss{" "}
      <span className="font-light font-['SourceCode']">({lifetime})</span>
    </span>
  </button>
);
