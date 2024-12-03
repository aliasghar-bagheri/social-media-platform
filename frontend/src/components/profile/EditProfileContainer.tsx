import EditProfileForm from "@/forms/profile/EditProfileForm";
import Heading from "@/components/shared/Heading";
import ChangePassword from "./ChangePassword";

const EditProfileContainer = () => {
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
      <EditProfileForm />
    </>
  );
};

export default EditProfileContainer;
