import { useState } from "react";

type LikeCommentProps = {
  likerId: string;
  commentId: string;
};

const LikeComment = ({ likerId, commentId }: LikeCommentProps) => {
  const [like, setLike] = useState<boolean>(false);

  return (
    <div
      id="like-comment"
      onClick={() => setLike((prevLike) => !prevLike)}
      className="flex items-center gap-1">
      {like ? (
        <img src="/assets/icons/liked.svg" alt="liked" />
      ) : (
        <img src="/assets/icons/like.svg" alt="like" />
      )}
      <label htmlFor="like-comment" className="tiny-medium text-light-3">
        3 likes
      </label>
    </div>
  );
};

export default LikeComment;
