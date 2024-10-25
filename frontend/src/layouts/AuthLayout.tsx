import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <section className="flex h-screen w-full items-center overflow-hidden">
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Outlet />
      </div>
      <div className="hidden h-full w-full flex-1 lg:flex">
        <img
          src="/assets/images/side-img.svg"
          alt="side"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
};

export default AuthLayout;
