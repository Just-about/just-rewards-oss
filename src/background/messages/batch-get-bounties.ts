import { trpc } from "@ja-packages/trpc";

import { clientTRPCQuery } from "~background/helpers/trpc.client";

import type { JrxBounty } from "@ja-packages/types/jarb";
import type { PlasmoMessaging } from "@plasmohq/messaging";

export type BatchGetBountiesRequest = {
  ids: number[];
};
export type BatchGetBountiesResponse = {
  bounties: JrxBounty[];
};

const handler: PlasmoMessaging.MessageHandler<
  BatchGetBountiesRequest,
  MessageResponse<BatchGetBountiesResponse>
> = async (req, res) => {
  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to BatchGetBounties",
        status: 400,
      },
    });
    return;
  }

  const [error, data] = await clientTRPCQuery(trpc.bounties.batchGetJrxBounties, {
    ids: req.body.ids,
  });

  if (error) {
    res.send({
      error: {
        message: "failed to get bounties by ID",
        status: 500,
      },
    });
    return;
  }

  res.send({
    data: {
      bounties: data.data,
    },
  });
};

export default handler;
