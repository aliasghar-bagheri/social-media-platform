import EditProfileContainer from "@/components/profile/EditProfileContainer";
import { Helmet } from "react-helmet-async";

const EditProfile = () => {
  return (
    <>
      <Helmet>
        <title>Edit Profile</title>
      </Helmet>
      <section className="container-section">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:w-9/12">
          <EditProfileContainer />
        </div>
      </section>
    </>
  );
};

export default EditProfile;
