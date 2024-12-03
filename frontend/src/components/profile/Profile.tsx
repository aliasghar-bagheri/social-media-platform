import { cn } from "@/lib/utils";
import { MAIN_ROUTES } from "@/routes";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ProfileProps = {
  userId: string;
  profileImage?: string;
  name?: string;
  subtitle?: string;
  containerStyles?: string;
  imageStyles?: string;
  nameStyles?: string;
  subtitleStyles?: string;
};

const Profile: FC<ProfileProps> = ({
  userId,
  profileImage = "/assets/icons/profile-placeholder.svg",
  name,
  subtitle,
  containerStyles,
  imageStyles,
  nameStyles = "body-bold",
  subtitleStyles = "small-regular text-light-3",
}) => {
  const avatarFallback = name ? name[0].toUpperCase() : "*";

  return (
    <Link to={`${MAIN_ROUTES.PROFILE}/${userId}`}>
      {" "}
      <div className={cn("flex items-center gap-2", containerStyles)}>
        <Avatar className={imageStyles}>
          <AvatarImage src={profileImage} alt="profile" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <p className={cn(nameStyles)}>{name}</p>
          <span className={cn(subtitleStyles)}>{subtitle}</span>
        </div>
      </div>
    </Link>
  );
};

export default Profile;
