import { trpc } from "@ja-packages/trpc";

import { clientTRPCQuery } from "~background/helpers/trpc.client";

import type { MixpanelEvent } from "@ja-packages/utils/mixpanel";
import type { PlasmoMessaging } from "@plasmohq/messaging";

export type TrackMixpanelEventRequest = {
  event: MixpanelEvent;
};
export type TrackMixpanelEventResponse = boolean;

const handler: PlasmoMessaging.MessageHandler<
  TrackMixpanelEventRequest,
  MessageResponse<TrackMixpanelEventResponse>
> = async (req, res) => {
  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to TrackMixpanelEvent",
        status: 400,
      },
    });
    return;
  }

  const [error] = await clientTRPCQuery(
    trpc.tracking.trackEvent,
    req.body.event
  );

  if (error) {
    res.send({
      error: {
        message: "failed to track event",
        status: 500,
      },
    });
    return;
  }

  res.send({
    data: true,
  });
};

export default handler;
