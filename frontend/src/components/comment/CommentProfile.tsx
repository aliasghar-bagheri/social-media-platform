import Profile from "../profile/Profile";

type CommentProfileProps = {
  userId: string;
};

const CommentProfile = ({ userId }: CommentProfileProps) => {
  return (
    <>
      <Profile
        userId={userId}
        name={"John"}
        imageStyles="rounded-full object-cover w-9 h-9"
        nameStyles="small-semibold text-light-3"
      />
    </>
  );
};

export default CommentProfile;
