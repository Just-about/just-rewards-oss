import { MixpanelEvent } from "@ja-packages/utils/mixpanel";

import {
  TrackMixpanelEventRequest,
  TrackMixpanelEventResponse,
} from "~background/messages/track-mixpanel-event";
import { backgroundMessage } from "~utils/messages/background-message";

export const trackEvent = async (event: MixpanelEvent) =>
  backgroundMessage<TrackMixpanelEventRequest, TrackMixpanelEventResponse>(
    "track-mixpanel-event",
    { event }
  );
