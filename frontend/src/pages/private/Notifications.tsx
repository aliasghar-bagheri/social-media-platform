import NotificationContainer from "@/components/notification/NotificationContainer";
import { Helmet } from "react-helmet-async";

const Notifications = () => {
  return (
    <>
      <Helmet>
        <title>All notification</title>
      </Helmet>
      <section className="container-section">
        <div className="flex w-full flex-col gap-8">
          <NotificationContainer />
        </div>
      </section>
    </>
  );
};

export default Notifications;
