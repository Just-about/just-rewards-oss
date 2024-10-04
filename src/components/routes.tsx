import { BountyListPage } from "~pages/BountyListPage";
import { BountyPage } from "~pages/BountyPage";
import { IndexPage } from "~pages/IndexPage";

import type { FC } from "react";

export const ROUTES: Record<string, FC<any>> = {
  "/": IndexPage,
  // The order here is important because of glob matching
  "/bounties/list/:bountyIDs": BountyListPage,
  "/bounties/:bountyID": BountyPage,
};
