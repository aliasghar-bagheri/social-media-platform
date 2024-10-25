import PostDetailsContainer from "@/components/post/PostDetailsContainer";
import RelatedPosts from "@/components/post/RelatedPosts";
import { useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();

  return (
    <section className="container-section">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PostDetailsContainer postId={id!} />
        <hr />
        <RelatedPosts postId={id!} />
      </div>
    </section>
  );
};

export default PostDetails;
