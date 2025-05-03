
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from "./pages/HomePage";
import ArtistsPage from "./pages/ArtistsPage";
import ArtistDetailPage from "./pages/ArtistDetailPage";
import CatalogPage from "./pages/CatalogPage";
import AboutJoePage from "./pages/AboutJoePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ArtistDashboardPage from "./pages/ArtistDashboardPage";
import EditProfilePage from "./pages/EditProfilePage";
import Layout from "./components/Layout";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/artists" element={<ArtistsPage />} />
                  <Route path="/artists/:artistId" element={<ArtistDetailPage />} />
                  <Route path="/catalog/:type" element={<CatalogPage />} />
                  <Route path="/about-joe" element={<AboutJoePage />} />
                  <Route path="/dashboard" element={<ArtistDashboardPage />} />
                  <Route path="/edit-profile" element={<EditProfilePage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
