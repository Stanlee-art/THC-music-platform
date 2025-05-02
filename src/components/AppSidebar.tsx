
import { NavLink } from "react-router-dom";
import { Album, Disc, List, Moon, Music, Search, Sun, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="h-8 w-8 text-thc-blue" />
            <span className="text-2xl font-bold text-glow text-thc-blue">
              THC
            </span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className={({isActive}) => 
                    isActive ? "text-thc-blue" : "text-sidebar-foreground hover:text-thc-blue"
                  }>
                    <Music className="mr-2 h-5 w-5" />
                    <span>Home</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/search" className={({isActive}) => 
                    isActive ? "text-thc-blue" : "text-sidebar-foreground hover:text-thc-blue"
                  }>
                    <Search className="mr-2 h-5 w-5" />
                    <span>Search</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/artists" className={({isActive}) => 
                    isActive ? "text-thc-blue" : "text-sidebar-foreground hover:text-thc-blue"
                  }>
                    <User className="mr-2 h-5 w-5" />
                    <span>Artists</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>Music Catalog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/catalog/singles" className={({isActive}) => 
                    isActive ? "text-thc-blue" : "text-sidebar-foreground hover:text-thc-blue"
                  }>
                    <Music className="mr-2 h-5 w-5" />
                    <span>Singles</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/catalog/albums" className={({isActive}) => 
                    isActive ? "text-thc-blue" : "text-sidebar-foreground hover:text-thc-blue"
                  }>
                    <Album className="mr-2 h-5 w-5" />
                    <span>Albums</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/catalog/mixtapes" className={({isActive}) => 
                    isActive ? "text-thc-blue" : "text-sidebar-foreground hover:text-thc-blue"
                  }>
                    <Disc className="mr-2 h-5 w-5" />
                    <span>Mixtapes</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/catalog/eps" className={({isActive}) => 
                    isActive ? "text-thc-blue" : "text-sidebar-foreground hover:text-thc-blue"
                  }>
                    <List className="mr-2 h-5 w-5" />
                    <span>EPs</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="w-full justify-between"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
