import { T_Notification, T_NotificationType } from "@/types";
import NotificationItem from "./NotificationItem";

type NotificationListProps = {
  data: T_Notification[];
  filterType: T_NotificationType | "all";
};

const filterNotification = (
  data: T_Notification[],
  filterType: T_NotificationType | "all",
) => {
  if (data.length) {
    if (filterType !== "all") {
      const filterdDataList = data.filter((item) => item.type === filterType);
      return filterdDataList;
    }
    return data;
  }
};

const NotificationList = ({ data, filterType }: NotificationListProps) => {
  const filteredNotificaions = filterNotification(data, filterType);

  return (
    <div className="h-full w-full">
      {filteredNotificaions?.length ? (
        filteredNotificaions.map((item) => (
          <NotificationItem key={item.id} data={item} />
        ))
      ) : (
        <p className="body-bold text-center">Nothing found.</p>
      )}
    </div>
  );
};

export default NotificationList;
