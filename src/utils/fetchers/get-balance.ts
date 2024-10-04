import { ENDPOINTS } from "@ja-packages/utils/endpoints";

import { getFromStrapi } from "~utils/fetchers";

export const getBalance = async (): Promise<number | null> => {
  const balance = await getFromStrapi(ENDPOINTS.GET_BALANCE());

  return balance !== null ? Number(balance) : null;
};
