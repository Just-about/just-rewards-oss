import classNames from "classnames";
import { useCallback } from "react";

import { BookmarkIconSolid } from "@ja-packages/icons/solid/Bookmark";

import { useRouter } from "~components/RouterOutlet";
import { toggleBookmark } from "~utils/fetchers";

interface BookmarkButtonProps {
  communitySlug: string;
  isBookmarked: boolean | null;
  postID: number;
  onBookmark: () => void;
}

export const BookmarkButton = ({ communitySlug, isBookmarked, postID, onBookmark }: BookmarkButtonProps) => {
  const router = useRouter();

  const onClick = useCallback(async () => {
    await toggleBookmark({ postID });
    onBookmark();
  }, [onBookmark, communitySlug, isBookmarked, postID, router]);

  return (
    <button
      type="button"
      className={classNames(
        " bg-[#252435] size-[40px] rounded-[16px] flex items-center justify-center hover:opacity-90 cursor-pointer",
        {
          "text-[#B882F8]": isBookmarked,
          "text-neutral-500": !isBookmarked,
        }
      )}
      onClick={onClick}
    >
      <BookmarkIconSolid className="size-[18px]" />
    </button>
  );
};
