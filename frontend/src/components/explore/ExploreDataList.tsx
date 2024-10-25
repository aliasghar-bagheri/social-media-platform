import { T_Post } from "@/types";
import PostCard from "../post/PostCard";

const ExploreDataList = () => {
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

  return (
    <div className="grid-section">
      {initialData.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ExploreDataList;
