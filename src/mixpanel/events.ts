import { EventProperties } from "./types";

export enum EventType {
  REWARDS_NOTIFICATIONS_TRIGGERED = "Rewards notification: Triggered",
  REWARDS_NOTIFICATION_VIEW_REWARDS_BUTTON_CLICKED = "Rewards notification: View rewards button clicked",
  REWARDS_NOTIFICATION_DISMISSED = "Rewards notification: Dismissed",
  BOUNTY_SUBMISSION_INTENT_STARTED = "Bounty reward submission intent clicked",
  CLICKED_BOUNTY_DETAIL_FROM_LIST_VIEW = "Clicked bounty details from list view",
  BUTTON_CLICKED = "Button clicked",
}

type EventData = {
  [EventType.REWARDS_NOTIFICATIONS_TRIGGERED]: {};
  [EventType.REWARDS_NOTIFICATION_VIEW_REWARDS_BUTTON_CLICKED]: {};
  [EventType.REWARDS_NOTIFICATION_DISMISSED]: {};
  [EventType.BOUNTY_SUBMISSION_INTENT_STARTED]: {};
  [EventType.BUTTON_CLICKED]: {
    location:
      | "profile"
      | "balance"
      | "view-all-rewards"
      | "notifications"
      | "view-rules"
      | "notification-dismissed";
  };
  [EventType.CLICKED_BOUNTY_DETAIL_FROM_LIST_VIEW]: {};
};

export type EventPropertiesMap = {
  [type in keyof EventData]: EventProperties<EventData[type]>;
};
