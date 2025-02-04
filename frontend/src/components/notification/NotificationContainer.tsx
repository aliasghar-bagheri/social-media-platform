import { useState } from "react";
import SelectFilter from "@/components/shared/SelectFilter";
import NotificationList from "./NotificationList";
import { T_Notification, T_NotificationType } from "@/types";
import Heading from "../shared/Heading";

const NotificationContainer = () => {
  const [notificationType, setNotificationType] = useState<
    T_NotificationType | "all"
  >("all");

  const initialData: T_Notification[] = [
    {
      id: "2",
      type: "like",
    },
    {
      id: "3",
      type: "follow",
    },
    {
      id: "5",
      type: "follow",
    },
    {
      id: "4",
      type: "comment",
    },
  ];

  const handleValueChange = (value: string) => {
    setNotificationType(value as T_NotificationType);
  };

  return (
    <div className="w-full space-y-14">
      <div className="flex w-full items-center justify-between">
        <Heading
          variant="h2-bold"
          icon={
            <img
              src="/assets/icons/notification.svg"
              width={36}
              height={36}
              className="invert-white"
              alt="notification"
            />
          }>
          Notifications
        </Heading>
        <SelectFilter
          value={notificationType}
          onValueChange={handleValueChange}
          selectItemList={["all", "follow", "like", "comment"]}
        />
      </div>
      <NotificationList data={initialData} filterType={notificationType} />
    </div>
  );
};

export default NotificationContainer;
