import { STORAGE_KEYS, getStoredData } from "~utils/storage";

export const getAppRouteEntrypoint = async () => {
  const currentBounties = await getStoredData<string>(STORAGE_KEYS.CURRENT_BOUNTIES);
  if (!currentBounties) return ["/"];

  const splitCurrentBounties = currentBounties.split(",");

  // show the bounties list view if there are multiple bounties available
  if (splitCurrentBounties.length > 1) return [`/`, `/bounties/list/${currentBounties}`];

  // show the bounty view if there is only one bounty
  return [`/`, `/bounties/${currentBounties}`];
};
