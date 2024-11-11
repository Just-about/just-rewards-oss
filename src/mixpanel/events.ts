import { EventProperties } from "./types";

export enum EventType {
  REWARDS_NOTIFICATIONS_TRIGGERED = "Rewards notification: Triggered",
  REWARDS_NOTIFICATION_VIEW_REWARDS_BUTTON_CLICKED = "Rewards notification: View rewards button clicked",
  BOUNTY_SUBMISSION_INTENT_STARTED = "Bounty reward submission intent clicked",
  CLICKED_BOUNTY_DETAIL_FROM_LIST_VIEW = "Clicked bounty details from list view",
  BUTTON_CLICKED = "Button clicked",
  EXTENSION_OPENED_VIA_TOOLBAR = "Extension opened via toolbar",
}

type EventData = {
  [EventType.REWARDS_NOTIFICATIONS_TRIGGERED]: {
    domain: string;
  };
  [EventType.REWARDS_NOTIFICATION_VIEW_REWARDS_BUTTON_CLICKED]: {
    domain: string;
  };
  [EventType.BOUNTY_SUBMISSION_INTENT_STARTED]: {};
  [EventType.BUTTON_CLICKED]: {
    location:
      | "profile"
      | "balance"
      | "view-all-rewards"
      | "notifications"
      | "view-rules"
      | "notification-dismissed";
    domain?: string;
  };
  [EventType.CLICKED_BOUNTY_DETAIL_FROM_LIST_VIEW]: {};
  [EventType.EXTENSION_OPENED_VIA_TOOLBAR]: {};
};

export type EventPropertiesMap = {
  [type in keyof EventData]: EventProperties<EventData[type]>;
};
