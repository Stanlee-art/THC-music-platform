
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { MusicPlayer } from "./MusicPlayer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default Layout;
