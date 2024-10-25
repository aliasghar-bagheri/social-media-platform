import TopCreators from "@/components/people/TopCreators";
import PostContainer from "@/components/post/PostContainer";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Snapgram | Social media app for sharing daily posts</title>
      </Helmet>
      <section className="container-section">
        <div className="scrollbar flex max-h-screen w-full overflow-y-auto">
          <PostContainer />
          <TopCreators />
        </div>
      </section>
    </>
  );
};

export default Home;
