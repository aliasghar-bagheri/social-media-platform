import { T_Comment } from "@/types";
import CommentItem from "./CommentItem";

type CommentsContainerProps = {
  postId: string;
};

const CommentsContainer = ({ postId }: CommentsContainerProps) => {
  const initialCommentsData: T_Comment[] = [
    {
      id: "2",
      user_id: "2",
      post_id: postId,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla, quisquam. amet, consectetur adipisicing elit. Nulla",
      created_at: "1d",
      modified_at: "",
    },
  ];

  return (
    <div className="scrollbar flex h-64 w-full flex-col gap-8 overflow-y-auto">
      {initialCommentsData?.length ? (
        initialCommentsData.map((comment) => (
          <CommentItem key={comment.id} commentData={comment} />
        ))
      ) : (
        <p className="subtle-semibold w-full text-center">No comment</p>
      )}
    </div>
  );
};

export default CommentsContainer;
