import Profile from "@/components/profile/Profile";
import { T_Notification } from "@/types";
import NotificationIcon from "./NotificationIcon";

type NotificationItemProps = {
  data: T_Notification;
};

const NotificationItem = ({ data }: NotificationItemProps) => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-between gap-5 p-8 sm:flex-row sm:gap-0">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-10">
          <NotificationIcon iconType={data.type} />
          <Profile name="Aliasghar" userId={"1"} subtitle="4 minutes ago" />
        </div>

        <div className="online"></div>
      </div>
      <hr />
    </>
  );
};

export default NotificationItem;
