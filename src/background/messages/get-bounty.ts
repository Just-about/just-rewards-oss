import { trpc } from "@ja-packages/trpc";

import { clientTRPCQuery } from "~background/helpers/trpc.client";

import type { JrxBounty } from "@ja-packages/types/jarb";
import type { PlasmoMessaging } from "@plasmohq/messaging";

export type GetBountyRequest = {
  id: number;
};
export type GetBountyResponse = JrxBounty;

const handler: PlasmoMessaging.MessageHandler<GetBountyRequest, MessageResponse<GetBountyResponse>> = async (
  req,
  res
) => {
  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to GetBounty",
        status: 400,
      },
    });
    return;
  }

  const [error, data] = await clientTRPCQuery(trpc.bounties.getJrxBounty, {
    id: req.body.id,
  });

  if (error) {
    res.send({
      error: {
        message: "failed to get bounty by ID",
        status: 500,
      },
    });
    return;
  }

  res.send({
    data: data.data,
  });
};

export default handler;
