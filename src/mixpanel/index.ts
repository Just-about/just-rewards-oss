import mixpanel from "mixpanel-browser";

import { UserType } from "@ja-packages/types";
import { EventPropertiesMap, EventType } from "@ja-packages/utils/mixpanel";

import {
  TrackMixpanelEventRequest,
  TrackMixpanelEventResponse,
} from "~background/messages/track-mixpanel-event";
import { backgroundMessage } from "~utils/messages/background-message";
import { getStoredData, STORAGE_KEYS } from "~utils/storage";

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
        "Skipping Mixpanel event because the token is missing from ENV"
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
  trackEvent: async <T extends EventType>({
    eventType,
    eventProperties,
  }: {
    eventType: T;
    eventProperties: EventPropertiesMap[T];
  }) => {
    if (!mixpanelToken) return;

    const user = await getStoredData<UserType>(STORAGE_KEYS.USER_DATA);
    if (user?.staff) return;

    mixpanel.track(`JRX: ${eventType}`, eventProperties, {
      send_immediately: true,
    });
  },
  trackEventInBackground: async <T extends EventType>({
    eventType,
    eventProperties,
  }: {
    eventType: T;
    eventProperties: EventPropertiesMap[T];
  }) =>
    backgroundMessage<TrackMixpanelEventRequest, TrackMixpanelEventResponse>(
      "track-mixpanel-event",
      {
        event: eventType,
        properties: eventProperties,
      }
    ),
};
