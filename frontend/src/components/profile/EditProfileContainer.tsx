import EditProfileForm from "@/forms/profile/EditProfileForm";
import Heading from "@/components/shared/Heading";
import ChangePassword from "./ChangePassword";

const EditProfileContainer = () => {
  const demoDataUser = {
    profile: "/assets/images/profile.png",
    name: "John",
    username: "John",
    email: "example@gmail.com",
    phone: "123456789",
    bio: "Hello World",
  };

  const handleEditProfile = () => {};

  return (
    <>
      <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Heading
          icon={
            <img
              src="/assets/icons/edit.svg"
              width={36}
              height={36}
              className="invert-white"
              alt="edit"
            />
          }
          variant="h1-bold">
          Edit Profile
        </Heading>
        <ChangePassword />
      </div>
      <EditProfileForm
        initialData={demoDataUser}
        handleEditProfile={handleEditProfile}
      />
    </>
  );
};

export default EditProfileContainer;
