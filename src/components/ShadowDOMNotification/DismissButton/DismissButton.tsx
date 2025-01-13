import { twMerge } from "tailwind-merge";

import { ArrowRightIconSolid } from "@ja-packages/icons/solid/ArrowRight";

interface DismissButtonProps {
  handleClick: () => void;
  lifetime: number;
}

export const DismissButton = ({ handleClick, lifetime }: DismissButtonProps) => (
  <button
    onClick={handleClick}
    className={twMerge(
      "rounded-[6px] px-[12px] py-[6px]",
      "flex items-center justify-center cursor-pointer transition-colors",
      "bg-[#8A30F4] hover:bg-[#5A19A7] focus::bg-[#5A19A7] border-2 border-white"
    )}
    type="button"
  >
    <span
      className={twMerge("text-white", "text-xs font-semibold font-['Poppins']", "flex items-center justify-center")}
    >
      Dismiss <span className="font-light font-['SourceCode']">({lifetime})</span>
    </span>
  </button>
);
