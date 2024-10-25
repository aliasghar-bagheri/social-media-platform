import { useState } from "react";

type SavePostProps = {
  postId: string;
};

const SavePost = ({ postId }: SavePostProps) => {
  const [saved, setSaved] = useState<boolean>(false);

  return (
    <div
      onClick={() => setSaved((prevSave) => !prevSave)}
      className="flex cursor-pointer items-center">
      {saved ? (
        <img src="/assets/icons/saved.svg" alt="saved" />
      ) : (
        <img src="/assets/icons/save.svg" alt="save" />
      )}
    </div>
  );
};

export default SavePost;
