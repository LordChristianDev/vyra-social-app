import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/context/use-auth";
import { ThemeProvider } from "@/context/use-theme";
import { ProfileProvider } from "@/context/use-profile";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticatedLayout, ProtectedRoute } from "@/components/layout/protected-layout";

import LandingPage from "@/features/authentication/pages/landing-page";
import LoginPage from "@/features/authentication/pages/login-page";
import HomePage from "@/features/dashboard/pages/home-page";
import ExplorePage from "@/features/dashboard/pages/explore-page";
import MessagesPage from "@/features/dashboard/pages/messages-page";
import NotificationsPage from "@/features/personalization/pages/notifications-page";
import ProfilePage from "@/features/personalization/pages/profile-page";
import ViewProfilePage from "@/features/personalization/pages/view-profile-page";
import SettingsPage from "@/features/personalization/pages/settings-page";
import NotFound from "@/features/authentication/pages/not-found";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Routes>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/explore" element={<ExplorePage />} />
                      <Route path="/messages" element={<MessagesPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/view-profile/:id" element={<ViewProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </TooltipProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;