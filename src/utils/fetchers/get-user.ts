import { ENDPOINTS } from "@ja-packages/utils/endpoints";

import { getFromStrapi } from "~utils/fetchers";

import type { UserType } from "@ja-packages/types";

export const getUser = (): Promise<UserType | null> =>
  getFromStrapi(ENDPOINTS.GET_USERS_ME());
