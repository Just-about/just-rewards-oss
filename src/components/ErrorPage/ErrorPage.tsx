import classNames from "classnames";
// eslint-disable-next-line import/no-unresolved
import grimace from "data-base64:~assets/emoji/grimace.png";

import { RotateIconSolid } from "@ja-packages/icons/solid/Rotate";

import { Button } from "~components/Button";

interface ErrorPageProps {
  onRetry: () => void;
}

export const ErrorPage = ({ onRetry }: ErrorPageProps) => {
  return (
    <div className="h-full place-content-center">
      <div className="flex justify-center mb-2">
        <img
          className={classNames("-rotate-6")}
          src={grimace}
          alt="Grimacing emoji"
          width="112px"
          height="112px"
        />
      </div>
      <div
        className={classNames(
          "flex justify-center",
          "text-white font-['Poppins'] font-bold text-xl mx-6 mb-4"
        )}
      >
        <p className="text-center">
          Uh oh!
          <br />
          Something went wrong
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          color="white"
          size="md"
          onClick={onRetry}
          iconLeft={RotateIconSolid}
          className="rounded-[0.75rem]"
        >
          Retry
        </Button>
      </div>
    </div>
  );
};
