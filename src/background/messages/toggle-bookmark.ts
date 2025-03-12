import { trpc } from "@ja-packages/trpc";

import { clientTRPCMutate } from "~background/helpers/trpc.client";

import type { PlasmoMessaging } from "@plasmohq/messaging";

export type ToggleBookmarkRequest = { postID: number };
export type ToggleBookmarkResponse = {} | { error: { message: string } };

const handler: PlasmoMessaging.MessageHandler<ToggleBookmarkRequest, MessageResponse<ToggleBookmarkResponse>> = async (
  req,
  res
) => {
  if (!req.body || !req.body.postID) {
    res.send({
      error: {
        message: "invalid arguments passed to Bookmark",
        status: 400,
      },
    });

    return;
  }

  const [error] = await clientTRPCMutate(trpc.posts.toggleBookmark, {
    postID: req.body.postID,
    source: "jrx",
  });

  if (error) {
    res.send({
      error: {
        message: "failed to toggle bookmark",
        status: 500,
      },
    });

    return;
  }

  res.send({ data: {} });
};

export default handler;
