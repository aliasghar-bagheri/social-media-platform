import PeopleList from "@/components/people/PeopleList";
import Heading from "@/components/shared/Heading";
import { Helmet } from "react-helmet-async";

const People = () => {
  return (
    <>
      <Helmet>
        <title>All users for follow</title>
      </Helmet>
      <section className="container-section">
        <div className="flex w-full flex-col gap-8">
          <Heading
            icon={
              <img
                src="/assets/icons/people.svg"
                className="invert-white"
                alt="people"
              />
            }>
            All Users
          </Heading>
          <PeopleList />
        </div>
      </section>
    </>
  );
};

export default People;
