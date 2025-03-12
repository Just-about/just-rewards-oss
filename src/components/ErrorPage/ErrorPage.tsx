import { RotateIconSolid } from "@ja-packages/icons/solid/Rotate";

import { Button } from "~components/Button";

interface ErrorPageProps {
  onRetry: () => void;
}

export const ErrorPage = ({ onRetry }: ErrorPageProps) => {
  return (
    <div className="flex flex-col gap-xs h-[468px] items-center justify-center">
      <p className="text-center font-['Basic Sans'] font-bold text-3xl text-neutral-50 leading-[80%]">Hmmm...</p>
      <p className="text-center font-['SourceSans3'] text-base text-neutral-400 leading-[120%]">
        Something isn&apos;t right
      </p>
      <Button color="light-purple" iconLeft={RotateIconSolid} className="mx-auto" ghost href="https://justabout.com">
        Retry
      </Button>
    </div>
  );
};
