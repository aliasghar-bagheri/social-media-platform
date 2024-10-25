import { T_NotificationType } from "@/types";

type NotificationIconProps = {
  iconType: T_NotificationType;
};

const notificationIcon = {
  like: <img src="/assets/icons/like.svg" alt="like" />,
  comment: <img src="/assets/icons/chat.svg" alt="comment" />,
  follow: <img src="/assets/icons/user.svg" alt="follow" />,
};

const NotificationIcon = ({ iconType }: NotificationIconProps) => {
  const icon = notificationIcon[iconType];

  return <div className="rounded-full bg-dark-4 p-2">{icon}</div>;
};

export default NotificationIcon;
