import { PlasmoMessaging } from "@plasmohq/messaging";

import { UserType } from "@ja-packages/types";

import { Tracking } from "~mixpanel";
import { EventPropertiesMap, EventType } from "~mixpanel/events";
import { MixpanelTrackIdentifyUser } from "~mixpanel/types";

export type TrackEventRequest<T extends EventType = EventType> = {
  type: T;
  data: EventPropertiesMap[T];
  user?: MixpanelTrackIdentifyUser | UserType | null;
};
export type TrackEventResponse = {};

const handler: PlasmoMessaging.MessageHandler<
  TrackEventRequest,
  MessageResponse<TrackEventResponse>
> = async (req, res) => {
  if (!req.body?.type || !req.body.data) return;

  // eslint-disable-next-line no-console
  console.log("Background worker scheduling tracking event", req.body);

  Tracking.trackEvent(req.body.type, req.body.data, req.body?.user);

  res.send({ data: {} });
};

export default handler;
