import SavedPostsList from "@/components/saved/SavedPostsList";
import Heading from "@/components/shared/Heading";
import { Helmet } from "react-helmet-async";

const Saved = () => {
  return (
    <>
      <Helmet>
        <title>Saved posts</title>
      </Helmet>
      <section className="container-section">
        <div className="flex w-full flex-col gap-8">
          <Heading
            icon={
              <img
                src="/assets/icons/save.svg"
                width={36}
                height={36}
                className="invert-white"
                alt="save"
              />
            }>
            Saved Posts
          </Heading>

          <SavedPostsList />
        </div>
      </section>
    </>
  );
};

export default Saved;
