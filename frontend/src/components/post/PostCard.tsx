import { Link } from "react-router-dom";
import Profile from "../profile/Profile";
import LikePost from "./LikePost";
import SavePost from "./SavePost";
import { MAIN_ROUTES } from "@/routes";
import { T_Post } from "@/types";

type PostCardProps = {
  post: T_Post;
};

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="group relative h-72 overflow-hidden rounded-[30px]">
      <Link to={`${MAIN_ROUTES.POST_DETAILS}/${post.user_id}`}>
        <img
          src={post.image_url}
          width={340}
          height={357}
          className="h-full w-full object-cover"
          alt="image"
        />
        <img
          src="/assets/icons/carousel.svg"
          className="absolute right-5 top-5"
          alt="carousel image"
        />
      </Link>

      <div className="absolute bottom-0 left-0 flex w-full items-center justify-between gap-3 bg-gradient-to-t from-dark-2 via-dark-3/70 via-50% p-5">
        <Profile
          name="Aliasghar"
          userId={post.user_id}
          imageStyles="w-8 h-8"
          nameStyles="subtle-semibold"
        />
        <div className="flex items-center gap-4">
          <LikePost postId={post.id} />
          <SavePost postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
