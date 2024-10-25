import { T_Post } from "@/types";
import PostItemList from "./PostItemList";
import Heading from "@/components/shared/Heading";

const PostContainer = () => {
  const initialData: T_Post[] = [
    {
      id: "1",
      user_id: "2",
      caption: "River and sun ",
      image_url: "/assets/images/example.jpg",
      tags: ["river", "car", "beautiful"],
    },
  ];

  return (
    <div className="flex flex-1 flex-col items-center gap-10">
      <Heading variant="h2-bold">Home Page</Heading>
      <PostItemList postDataList={initialData} />
      <PostItemList postDataList={initialData} />
    </div>
  );
};

export default PostContainer;
