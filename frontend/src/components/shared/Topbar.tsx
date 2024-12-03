import { MAIN_ROUTES } from "@/routes";
import { Link } from "react-router-dom";
import { useState } from "react";
import Menu from "./Menu";
import { useAuth } from "@/context/AuthProvider";
import Profile from "@/components/profile/Profile";
import Spinner from "@/components/ui/Spinner";

const Topbar = () => {
  const [show, setShow] = useState<boolean>(false);

  const { user, isLoading } = useAuth();

  return (
    <header className="relative flex w-full items-center justify-between gap-3 border-b px-2 py-3 lg:hidden">
      <Link to={MAIN_ROUTES.HOME}>
        <img src="/assets/images/logo.svg" width={130} height={27} alt="logo" />
      </Link>

      <nav className="flex items-center gap-3">
        {isLoading ? (
          <Spinner />
        ) : (
          <Profile userId={user?.id} profileImage={user?.profile} />
        )}

        <Menu isOpen={show} onChangeOpen={() => setShow((prevShow) => !prevShow)} />
      </nav>
    </header>
  );
};

export default Topbar;
