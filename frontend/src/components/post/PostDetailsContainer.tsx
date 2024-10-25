import { MAIN_ROUTES } from "@/routes";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CommentsContainer from "@/components/comment/CommentsContainer";
import Profile from "@/components/profile/Profile";
import LikePost from "./LikePost";
import SavePost from "./SavePost";
import AddCommentContainer from "@/components/comment/AddCommentContainer";
import PostImagesSlider from "./PostImagesSlider";
import PostTag from "./PostTag";
import DeletePost from "./DeletePost";

type PostDetailsContainerProps = {
  postId: string;
};

const PostDetailsContainer = ({ postId }: PostDetailsContainerProps) => {
  return (
    <section className="w-full">
      <Helmet>
        <title>Exploring the wild life</title>
      </Helmet>
      <div className="flex h-full min-h-[582px] w-full flex-col overflow-hidden rounded-[30px] xl:flex-row">
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <PostImagesSlider postId={postId} />
        </div>

        <div className="flex h-full w-full flex-1 flex-col items-center justify-between gap-5 bg-dark-2 px-7 py-9">
          <div className="flex w-full justify-between">
            <Profile userId={"1"} name="Aliasghar" subtitle="26 June at 09:32 PM" />

            <div className="flex items-center gap-3">
              <Link to={`${MAIN_ROUTES.EDIT_POST}/3`}>
                <img
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  className="invert-yellow"
                />
              </Link>
              <DeletePost />
            </div>
          </div>

          <p className="base-semibold w-full border-b pb-5">
            Exploring the wild life! <PostTag postId={postId} />
          </p>

          <CommentsContainer postId={postId} />

          <div className="flex w-full flex-col gap-8">
            <div className="mt-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-8">
                <LikePost postId={postId} />
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/chat.svg" alt="chat" />
                  <span>0</span>
                </div>
              </div>
              <SavePost postId={postId} />
            </div>
            <AddCommentContainer postId={postId} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostDetailsContainer;
