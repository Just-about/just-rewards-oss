import { ToggleBookmarkRequest, ToggleBookmarkResponse } from "~background/messages/toggle-bookmark";
import { backgroundMessage } from "~utils/messages/background-message";

export const toggleBookmark = async ({ postID }: { postID: number }) =>
  backgroundMessage<ToggleBookmarkRequest, ToggleBookmarkResponse>("toggle-bookmark", {
    postID,
  });
