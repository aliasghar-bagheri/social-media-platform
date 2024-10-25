import { T_Post } from "@/types";
import PostItem from "./PostItem";

type PostDataListProps = {
  postDataList: T_Post[];
};

const PostItemList = ({ postDataList }: PostDataListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {postDataList.map((post: T_Post) => (
        <PostItem key={post.id} postData={post} />
      ))}
    </div>
  );
};

export default PostItemList;
