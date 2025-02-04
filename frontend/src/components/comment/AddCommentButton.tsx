import { useTransition } from "react";
import { Button } from "../ui/button";

type AddCommentButtonProps = {
  postId: string;
  userId: string;
  content: string;
  disabled?: boolean;
};

const AddCommentButton = ({
  postId,
  userId,
  content,
  disabled,
}: AddCommentButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleAddComment = () => {
    startTransition(() => {
      console.log("Add comment");
      console.log(postId);
      console.log(userId);
    });
  };

  return (
    <Button
      disabled={isPending || disabled || !content}
      onClick={handleAddComment}
      className="shadcn-btn_ghost absolute right-0"
      size="icon">
      <img src="/assets/icons/message.svg" alt="message" />
    </Button>
  );
};

export default AddCommentButton;
