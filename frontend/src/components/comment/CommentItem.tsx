import LikeComment from "./LikeComment";
import { T_Comment } from "@/types";
import CommentContent from "./CommentContent";

type CommentItemProps = {
  commentData: T_Comment;
};

const CommentItem = ({ commentData }: CommentItemProps) => {
  return (
    <div className="flex w-full items-start justify-between gap-5 md:px-2">
      <div className="flex flex-1 items-start gap-2">
        <CommentContent
          userId={commentData.user_id}
          content={commentData.content}
          createdAt={commentData.created_at}
        />
      </div>
      <LikeComment likerId={"1"} commentId={commentData.id} />
    </div>
  );
};

export default CommentItem;
