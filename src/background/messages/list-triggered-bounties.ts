import { trpc } from "@ja-packages/trpc";

import { clientTRPCQuery } from "~background/helpers/trpc.client";

import type { JrxBounty } from "@ja-packages/types/jarb";
import type { PlasmoMessaging } from "@plasmohq/messaging";

export type ListTriggeredBountiesRequest = {
  filter: {
    url: string;
  };
};
export type ListTriggeredBountiesResponse = {
  bounties: JrxBounty[];
  domainPotentialEarnings: number;
  rewardsAvailable: number;
};

const handler: PlasmoMessaging.MessageHandler<
  ListTriggeredBountiesRequest,
  MessageResponse<ListTriggeredBountiesResponse>
> = async (req, res) => {
  if (!req.body) {
    res.send({
      error: {
        message: "invalid arguments passed to ListTriggeredBounties",
        status: 400,
      },
    });
    return;
  }

  const [error, resp] = await clientTRPCQuery(trpc.bounties.listTriggeredJrxBounties, {
    filter: req.body.filter,
  });

  if (error) {
    res.send({
      error: {
        message: "failed to list triggered bounties",
        status: 500,
      },
    });
    return;
  }

  res.send({
    data: resp.data,
  });
};

export default handler;
