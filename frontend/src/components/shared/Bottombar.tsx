import { BottombarLinks } from "@/constants";
import { T_NavLink } from "@/types";
import { NavLink, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <section className="fixed bottom-0 left-0 h-24 w-full rounded-t-[20px] border border-dark-4 bg-dark-3 lg:hidden">
      <ul className="flex h-full w-full items-center justify-around">
        {BottombarLinks.map((link: T_NavLink) => {
          const isActive = pathname === link.href;

          return (
            <li
              key={link.label}
              className={`group rounded-lg ${isActive && "bg-primary-500"}`}>
              <NavLink
                to={link.href}
                className="flex h-[51px] w-[43px] flex-col items-center justify-center gap-1">
                <img
                  src={link.icon}
                  alt={link.label}
                  width={16}
                  height={16}
                  className={`${isActive && "invert-white"}`}
                />
                <p className="tiny-medium">{link.label}</p>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Bottombar;
