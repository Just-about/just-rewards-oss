import mixpanel from "mixpanel-browser";

import { UserType } from "@ja-packages/types";

import {
  TrackEventRequest,
  TrackEventResponse,
} from "~background/messages/mixpanel-track";
import { backgroundMessage } from "~utils/messages/background-message";

import { EventPropertiesMap, EventType } from "./events";
import { MixpanelTrackIdentifyUser } from "./types";

const mixpanelToken = process.env.PLASMO_PUBLIC_MIXPANEL_TOKEN;
const isProduction = process.env.NODE_ENV === "production";

if (mixpanelToken) {
  mixpanel.init(mixpanelToken, {
    debug: !isProduction,
    track_pageview: false,
    persistence: "localStorage",
    api_host: "https://api-eu.mixpanel.com",
    ignore_dnt: true, // Data sent to Mixpanel is completely anonymous
  });
}

export const Tracking = {
  identify: (user: MixpanelTrackIdentifyUser) => {
    if (!mixpanelToken) {
      // eslint-disable-next-line
      console.log(
        "Skipping Mixpanel event becuase the token is missing from ENV"
      );
      return;
    }

    if (user.staff) return;

    mixpanel.identify(user.id.toString());
    mixpanel.register({
      age: user.age,
      local_time: new Date().toLocaleTimeString(),
    });
  },
  scheduleTrack: async <T extends EventType>(
    eventType: T,
    eventProperties: EventPropertiesMap[T],
    user?: MixpanelTrackIdentifyUser | UserType | null
  ) => {
    await backgroundMessage<TrackEventRequest<T>, TrackEventResponse>(
      "mixpanel-track",
      {
        type: eventType,
        data: eventProperties,
        user,
      }
    );
  },
  trackEvent: <T extends EventType>(
    eventType: T,
    eventProperties: EventPropertiesMap[T],
    user?: MixpanelTrackIdentifyUser | UserType | null
  ) => {
    if (!mixpanelToken) return;
    if (user?.staff) return;

    // eslint-disable-next-line no-console
    console.log("Sending tracking event", eventType, eventProperties);

    mixpanel.track(`JRX: ${eventType}`, eventProperties, {
      send_immediately: true,
    });
  },
};
