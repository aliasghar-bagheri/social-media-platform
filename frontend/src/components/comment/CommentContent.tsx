import CommentProfile from "./CommentProfile";

type CommentContentProps = {
  userId: string;
  content: string;
  createdAt: string;
};

const CommentContent = ({ userId, content, createdAt }: CommentContentProps) => {
  return (
    <div className="flex flex-col items-start gap-3">
      <div>
        <CommentProfile userId={userId} />
        <span className="subtle-semibold text-light-2">{content}</span>
      </div>

      <p className="tiny-medium text-light-3">{createdAt}</p>
    </div>
  );
};

export default CommentContent;
