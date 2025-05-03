
import { Link, Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { MusicPlayer } from "./MusicPlayer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated, signOut, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto pb-20">
          <nav className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-white/5 p-4 flex justify-between items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-white/5",
                      currentPath === "/" && "text-thc-blue"
                    )}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/artists">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-white/5",
                      currentPath.includes("/artists") && "text-thc-blue"
                    )}>
                      Artists
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/catalog/albums">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-white/5",
                      currentPath.includes("/catalog") && "text-thc-blue"
                    )}>
                      Catalog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about-joe">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-white/5",
                      currentPath.includes("/about-joe") && "text-thc-blue"
                    )}>
                      It's All About Joe
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <div>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 hidden sm:inline">
                    <User className="inline h-4 w-4 mr-1" />
                    {user?.user_metadata?.username || user?.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={signOut} className="border-white/10">
                    <LogOut className="h-4 w-4 mr-1" /> Logout
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-white/10">
                    <LogIn className="h-4 w-4 mr-1" /> Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
          <Outlet />
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default Layout;
