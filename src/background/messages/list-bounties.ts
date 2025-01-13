import { trpc } from "@ja-packages/trpc";

import { clientTRPCQuery } from "~background/helpers/trpc.client";

import type { JrxBounty } from "@ja-packages/types/jarb";
import type { PlasmoMessaging } from "@plasmohq/messaging";

export type ListBountiesRequest = {
  filter?: {
    url: string;
  };
  limit?: number;
  sort?: "hot" | "new";
};
export type ListBountiesResponse = {
  bounties: JrxBounty[];
};

const handler: PlasmoMessaging.MessageHandler<ListBountiesRequest, MessageResponse<ListBountiesResponse>> = async (
  req,
  res
) => {
  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to ListBounties",
        status: 400,
      },
    });
    return;
  }

  const [error, data] = await clientTRPCQuery(trpc.bounties.listJrxBounties, {
    filter: req.body.filter,
    limit: req.body.limit,
    sort: req.body.sort,
  });

  if (error) {
    res.send({
      error: {
        message: "failed to list bounties",
        status: 500,
      },
    });
    return;
  }

  res.send({
    data: {
      bounties: data?.data || [],
    },
  });
};

export default handler;
