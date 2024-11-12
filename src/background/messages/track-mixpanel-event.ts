import { trpc } from "@ja-packages/trpc";
import { clientTRPCQuery } from "@ja-packages/trpc/query";

import type { EventType, EventProperties } from "@ja-packages/utils/mixpanel";
import type { PlasmoMessaging } from "@plasmohq/messaging";

export type TrackMixpanelEventRequest = {
  event: EventType;
  properties: unknown;
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

  const [error] = await clientTRPCQuery(trpc.tracking.trackEvent, {
    event: req.body.event,
    properties: req.body.properties,
  });

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
