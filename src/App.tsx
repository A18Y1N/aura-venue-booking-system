import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/routing/AdminRoute";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layouts
import AdminLayout from "@/layouts/AdminLayout";

// Navbars
import Navbar from "@/components/Navbar";

// Pages
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import MyBookings from "@/pages/MyBookings";
import AdminBookings from "@/pages/AdminBookings";

const queryClient = new QueryClient();

interface AppLayoutProps {
  children: React.ReactNode;
}

// Wrapper to decide and show the appropriate navbar (only for non-admin users)
const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const hideNavbar = ["/", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && user?.role !== "admin" && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppLayout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* User routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
              </Route>

              <Route
                path="/admin-requests"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminBookings />} />
              </Route>

              <Route path="*" element={<LoginPage />} />
            </Routes>
          </AppLayout>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
