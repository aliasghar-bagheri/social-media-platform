import ExploreContainer from "@/components/explore/ExploreContainer";
import { Helmet } from "react-helmet-async";

const Explore = () => {
  return (
    <>
      <Helmet>
        <title>Explore</title>
      </Helmet>
      <section className="container-section">
        <ExploreContainer />
      </section>
    </>
  );
};

export default Explore;
