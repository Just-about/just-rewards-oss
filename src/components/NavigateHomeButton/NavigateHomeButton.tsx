import classNames from "classnames";

import { ArrowLeftIconSolid } from "@ja-packages/icons/solid/ArrowLeft";

import { useRouter } from "~components/RouterOutlet";

type NavigateHomeButtonProps = { borderless?: boolean };

export const NavigateHomeButton = ({ borderless = false }: NavigateHomeButtonProps) => {
  const router = useRouter();

  return (
    <div
      className={classNames(
        {
          "border-b": !borderless,
        },
        "flex items-center h-[42px] border-white/[0.2] text-base text-neutral-400 z-20"
      )}
    >
      <div
        className="flex items-center pl-5"
        onClick={() =>
          // Scroll to the index page, keeping the history whilst we scroll back to the 0th page
          router
            .navigate(["/", ...router.history], 0)
            // Clear the history
            .then(() => router.navigate(["/"]))
        }
        role="presentation"
      >
        <ArrowLeftIconSolid />
        <span className="pl-1 cursor-pointer select-none font-['BasicSans'] font-semibold">Back</span>
      </div>
    </div>
  );
};
