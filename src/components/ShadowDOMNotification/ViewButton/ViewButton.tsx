import { twMerge } from "tailwind-merge";

import { ArrowRightIconSolid } from "@ja-packages/icons/solid/ArrowRight";

interface ViewButtonProps {
  handleClick: () => void;
}

export const ViewButton = ({ handleClick }: ViewButtonProps) => (
  <button
    onClick={handleClick}
    className={twMerge(
      "rounded-[6px] px-[12px] py-[6px] mr-2",
      "flex items-center justify-center cursor-pointer transition-colors",
      "bg-white hover:bg-white/80 border-2 border-transparent"
    )}
    type="button"
  >
    <span
      className={twMerge(
        "text-[#16151F]",
        "text-xs font-semibold font-['Poppins']",
        "flex gap-[6px] items-center justify-center"
      )}
    >
      <div className="rounded-full bg-[#8A30F4] w-[12px] h-[12px] flex items-center justify-center">
        <ArrowRightIconSolid className="text-white w-[8px] h-auto" />
      </div>
      View
    </span>
  </button>
);
