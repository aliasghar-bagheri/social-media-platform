import PostForm from "@/forms/post/PostForm";
import { Helmet } from "react-helmet-async";

const CreatePost = () => {
  const handleCreatePost = () => {};

  return (
    <>
      <Helmet>
        <title>Create a post</title>
      </Helmet>
      <section className="container-section">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:w-9/12">
          <PostForm type="Create" handlePostForm={handleCreatePost} />
        </div>
      </section>
    </>
  );
};

export default CreatePost;
