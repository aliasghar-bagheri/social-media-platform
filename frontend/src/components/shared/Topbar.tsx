import { MAIN_ROUTES } from "@/routes";
import { Link } from "react-router-dom";
import { useState } from "react";
import Profile from "../profile/Profile";
import Menu from "./Menu";

const Topbar = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <header className="relative flex w-full items-center justify-between gap-3 border-b px-2 py-3 lg:hidden">
      <Link to={MAIN_ROUTES.HOME}>
        <img src="/assets/images/logo.svg" width={130} height={27} alt="logo" />
      </Link>

      <nav className="flex items-center gap-3">
        <Profile userId={"2"} imageStyles="w-9 h-9" />

        <Menu isOpen={show} onChangeOpen={() => setShow((prevShow) => !prevShow)} />
      </nav>
    </header>
  );
};

export default Topbar;
