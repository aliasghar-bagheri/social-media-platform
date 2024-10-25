import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { MAIN_ROUTES } from "@/routes";
import { X } from "lucide-react";

type MenuProps = {
  isOpen: boolean;
  onChangeOpen: () => void;
};

const Menu = ({ isOpen, onChangeOpen }: MenuProps) => {
  return (
    <>
      <Button size="icon" variant="ghost" onClick={onChangeOpen}>
        {isOpen ? <X /> : <img src="/assets/icons/menu.svg" alt="menu" />}
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-16 z-40 flex w-full flex-col bg-dark-3/85 px-5 py-6 backdrop-blur-md">
          <ul className="flex flex-col gap-3">
            <li>
              <NavLink
                onClick={onChangeOpen}
                to={MAIN_ROUTES.PEOPLE}
                className="flex w-full items-center gap-3 rounded-lg p-4">
                <img src="/assets/icons/people.svg" alt="people" />
                <p className="base-medium">People</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onChangeOpen}
                to={MAIN_ROUTES.NOTIFICATIONS}
                className="flex w-full items-center gap-3 rounded-lg p-4">
                <img src="/assets/icons/notification.svg" alt="notifications" />
                <p className="base-medium">Notifications</p>
              </NavLink>
            </li>
          </ul>
          <Button
            variant="destructive"
            className="small-smibold mt-5 flex items-center gap-3">
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              width={16}
              height={16}
              className="invert-white"
            />
            Logout
          </Button>
        </div>
      )}
    </>
  );
};

export default Menu;
