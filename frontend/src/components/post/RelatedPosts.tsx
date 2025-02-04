import Heading from "@/components/shared/Heading";
import PostCard from "./PostCard";
import { T_Post } from "@/types";

type RelatedPostsProps = {
  postId: string;
};

const RelatedPosts = ({ postId }: RelatedPostsProps) => {
  const initialData: T_Post[] = [
    {
      id: "1",
      user_id: "1",
      image_url: "/assets/images/example.jpg",
    },
    {
      id: "2",
      user_id: "3",
      image_url: "/assets/images/example.jpg",
    },
    {
      id: "3",
      user_id: "10",
      image_url: "/assets/images/example.jpg",
    },
    {
      id: "4",
      user_id: "2",
      image_url: "/assets/images/example.jpg",
    },
  ];

  console.log(postId);

  return (
    <div className="w-full space-y-12">
      <Heading variant="h2-bold">More Related Posts</Heading>
      <div className="grid-section">
        {initialData.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
