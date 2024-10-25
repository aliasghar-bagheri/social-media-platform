import { MAIN_ROUTES } from "@/routes";
import { T_Post } from "@/types";
import { Link } from "react-router-dom";
import Profile from "@/components/profile/Profile";
import PostImages from "./PostImagesSlider";
import LikePost from "./LikePost";
import SavePost from "./SavePost";

type PostDataProps = {
  postData: T_Post;
};

const PostItem = ({ postData }: PostDataProps) => {
  return (
    <div className="max-w-screen-sm rounded-3xl border border-dark-4 bg-dark-2 p-5 lg:p-7">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Profile userId={"1"} name="Aliasghar" subtitle="26 June at 09:32 PM" />
          <Link to={`${MAIN_ROUTES.EDIT_POST}/${postData.id}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
          </Link>
        </div>
        <Link to={`${MAIN_ROUTES.POST_DETAILS}/${postData.id}`}>
          <p className="base-semibold">{postData.caption} </p>
        </Link>
        <span className="text-light-3"># {postData.tags}</span>
      </div>

      <PostImages postId={postData.id} />

      <div className="mt-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-8">
          <LikePost postId={postData.id} />
          <div className="flex items-center gap-2">
            <img src="/assets/icons/chat.svg" alt="chat" />
            <span>0</span>
          </div>
        </div>
        <SavePost postId={postData.id} />
      </div>
    </div>
  );
};

export default PostItem;
