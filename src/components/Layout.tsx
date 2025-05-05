
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/lib/roles-api";
import { LogIn, LogOut, User, Music, Settings } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { isAuthenticated, signOut, user } = useAuth();
  const { data: profile } = useUserProfile();

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
                {isAuthenticated && (
                  <NavigationMenuItem>
                    <Link to="/playlists">
                      <NavigationMenuLink className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-white/5",
                        currentPath.includes("/playlists") && "text-thc-blue"
                      )}>
                        <Music className="h-4 w-4 mr-1" />
                        Playlists
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            
            <div>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-white/10">
                        <User className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">
                          {profile?.display_name || profile?.username || user?.email?.split('@')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => navigate("/user-profile")}>
                        <User className="h-4 w-4 mr-2" /> Profile Settings
                      </DropdownMenuItem>
                      
                      {profile?.role === 'artist' && (
                        <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                          <Music className="h-4 w-4 mr-2" /> Artist Dashboard
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem onClick={() => navigate("/playlists")}>
                        <Music className="h-4 w-4 mr-2" /> My Playlists
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-white/10">
                    <LogIn className="h-4 w-4 mr-1" /> Sign In
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
