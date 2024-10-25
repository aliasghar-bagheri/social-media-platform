import Bottombar from "@/components/shared/Bottombar";
import Sidebar from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row lg:gap-x-5">
      <Topbar />
      <Sidebar />
      <main className="h-full w-full">
        <Outlet />
      </main>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
