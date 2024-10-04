// Properties that all server-side events must include
export type EventProperties<T extends {}> = T & {
  ipAddress?: string; // https://docs.mixpanel.com/docs/tracking/how-tos/effective-server-side-tracking#tracking-geolocation-server-side
};

export type MixpanelEvent = {
  event: string;
  properties: Record<string, any>;
};

export type MixpanelTrackIdentifyUser = {
  id: number;
  age?: number;
  staff: boolean;
};
