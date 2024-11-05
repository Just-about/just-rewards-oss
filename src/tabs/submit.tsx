/* eslint-disable import/no-unresolved */
import partyPopper from "data-url:./party-popper.png";
import imageSubmissionForm from "data-url:./submission-image.png";
import textSubmissionForm from "data-url:./submission-text.png";
import videoSubmissionForm from "data-url:./submission-video.png";
/* eslint-enable import/no-unresolved */
import { useCallback, useState } from "react";

import { CircleRightArrowSolid } from "@ja-packages/icons/solid/CircleRightArrow";

import { Button } from "~components/Button";
import { Tracking } from "~mixpanel";
import { EventType } from "~mixpanel/events";

import "../style.css";

const SuccessMessage = () => (
  <div className="flex flex-col justify-center items-center h-full w-full">
    <img
      alt="party popper emoji"
      className="w-[160px] h-auto mb-4"
      src={partyPopper}
    />
    <div className="max-w-[420px] text-center">
      <p className="font-['SourceSans3'] text-[#16151F] text-[16px] leading-[120%] mb-1">
        You have successfully submitted to the bounty and will be in with a
        chance for a reward! Good luck!
      </p>
    </div>
  </div>
);

const Submit = () => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const type = params.get("type");

  const [isSuccess, setIsSuccess] = useState(false);

  let submitImage = textSubmissionForm;

  if (type === "video") {
    submitImage = videoSubmissionForm;
  }
  if (type === "image") {
    submitImage = imageSubmissionForm;
  }

  const handleSubmitClick = useCallback(async () => {
    await Tracking.trackEvent({
      eventType: EventType.BOUNTY_SUBMISSION_INTENT_STARTED,
      eventProperties: {},
    });

    setIsSuccess(true);
  }, []);

  return (
    <div className="bg-white text-[#16151F] py-3 px-5 h-[100vh]">
      {!isSuccess ? (
        <div>
          <h2 className="text-[24px] font-semibold font-['Poppins'] mb-1.5">
            Submit to this bounty
          </h2>
          <p className="font-['SourceSans3'] text-[16px] leading-[120%] mb-1">
            Top-level task description in no more than 120 characters
          </p>
          <p className="font-['SourceSans3'] text-[12px] leading-[120%] text-[#16151F] opacity-60">
            Task specifics including entry deadline and word count / video
            length etc. Max 150 characters.
          </p>
          <img
            alt="submission form"
            className="w-full h-auto mt-4 cursor-text"
            src={submitImage}
          />
          <div className="mt-4 border-t pt-4">
            <Button
              size="sm"
              color="purple"
              iconLeft={CircleRightArrowSolid}
              onClick={handleSubmitClick}
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <SuccessMessage />
      )}
    </div>
  );
};

export default Submit;
