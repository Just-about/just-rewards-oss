import { trpc } from "@ja-packages/trpc";
import { clientTRPCQuery } from "@ja-packages/trpc/query";

import type { JrxTriggerUrl } from "@ja-packages/types/jarb";
import type { PlasmoMessaging } from "@plasmohq/messaging";

export type GetTriggerUrlsRequest = {
  bountyIDs: number[];
};
export type GetTriggerUrlsResponse = JrxTriggerUrl[];

const handler: PlasmoMessaging.MessageHandler<
  GetTriggerUrlsRequest,
  MessageResponse<GetTriggerUrlsResponse>
> = async (req, res) => {
  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to GetTriggerUrls",
        status: 400,
      },
    });
    return;
  }

  const [error, data] = await clientTRPCQuery(
    trpc.bounties.listJrxUrlTriggers,
    {
      filter: { bountyIDs: req.body.bountyIDs },
    }
  );

  if (error) {
    res.send({
      error: {
        message: "failed to list url triggers",
        status: 500,
      },
    });
    return;
  }

  res.send({
    data: data?.data,
  });
};

export default handler;
