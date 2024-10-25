import { SidebarLinks } from "@/constants";
import { T_NavLink } from "@/types";
import { Link, useLocation } from "react-router-dom";
const SidebarNavLinks = () => {
  const { pathname } = useLocation();

  return (
    <ul className="flex w-full flex-col items-center gap-6">
      {SidebarLinks.map((link: T_NavLink) => {
        const isActive = pathname === link.href;
        return (
          <li
            key={link.label}
            className={`w-full rounded-lg ${isActive && "bg-primary-500"} group hover:bg-primary-500`}>
            <Link to={link.href} className="flex items-center gap-2 p-4">
              <img
                src={link.icon}
                alt={link.label}
                className={`${isActive && "invert-white"} group-hover:invert-white`}
              />
              <p className="body-bold">{link.label}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNavLinks;
