import { MAIN_ROUTES } from "@/routes";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Profile from "../profile/Profile";
import SidebarNavLinks from "./SidebarNavLinks";

const Sidebar = () => {
  return (
    <div className="hidden h-screen min-w-72 gap-11 border lg:flex lg:flex-col lg:items-center lg:justify-between">
      <div className="flex h-full w-10/12 flex-col justify-between py-10">
        <div className="flex w-full flex-col items-start gap-11">
          <Link to={MAIN_ROUTES.HOME}>
            <img src="/assets/images/logo.svg" alt="logo" />
          </Link>
          <div className="flex w-full items-center justify-between">
            <Profile userId={"1"} name="Aliasghar" subtitle={`@aliasghar_hsb`} />
            <Link to={`${MAIN_ROUTES.NOTIFICATIONS}`} className="relative">
              <img src="/assets/icons/notification.svg" alt="notification" />
              <div className="small-semibold absolute -right-3 -top-3 h-5 w-5 rounded-lg bg-secondary-600 text-center text-dark-1">
                3
              </div>
            </Link>
          </div>
          <SidebarNavLinks />
        </div>

        <Button
          variant="ghost"
          className="body-bold flex w-full items-center justify-start gap-3 py-7">
          <img src="/assets/icons/logout.svg" alt="logout" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
