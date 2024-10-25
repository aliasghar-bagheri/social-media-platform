import { useState } from "react";

type LikePostProps = {
  postId: string;
};

const LikePost = ({ postId }: LikePostProps) => {
  const [like, setLike] = useState<boolean>(false);

  return (
    <div
      id="like-post"
      onClick={() => setLike((prevLike) => !prevLike)}
      className="flex cursor-pointer items-center gap-2">
      {like ? (
        <img src="/assets/icons/liked.svg" alt="liked" />
      ) : (
        <img src="/assets/icons/like.svg" alt="like" />
      )}
      <label htmlFor="like-post">{like ? "1" : "0"}</label>
    </div>
  );
};

export default LikePost;
