import { ChangeEvent, useState } from "react";
import Profile from "../profile/Profile";
import { Input } from "../ui/input";
import AddCommentButton from "./AddCommentButton";

type AddCommentContainerProps = {
  postId: string;
};

const AddCommentContainer = ({ postId }: AddCommentContainerProps) => {
  const [commentText, setCommentText] = useState<string>("");

  return (
    <div className="flex w-full items-center gap-3">
      <Profile userId={"1"} imageStyles="w-10 h-10" />

      <div className="relative flex w-full items-center">
        <Input
          type="text"
          value={commentText}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setCommentText(event.target.value)
          }
          className="shadcn-input"
          placeholder="Write your comment..."
        />
        <AddCommentButton postId={postId} userId={"2"} content={commentText} />
      </div>
    </div>
  );
};

export default AddCommentContainer;
