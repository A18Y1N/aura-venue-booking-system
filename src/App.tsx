import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Auth Pages
import AuthDisplay from "./pages/AuthDisplay";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";

// User Pages
import Dashboard from "./pages/Dashboard";
import HallDetail from "./pages/HallDetail";
import MyBookings from "./pages/MyBookings";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminRequests from "./pages/AdminRequests";

// Other Pages
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children, requiresAdmin = false }: { children: React.ReactNode, requiresAdmin?: boolean }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-academy-background">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-t-academy-blue rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-academy-text">Loading...</p>
        </motion.div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (requiresAdmin && !user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthDisplay />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/hall/:hallId" element={
        <ProtectedRoute>
          <HallDetail />
        </ProtectedRoute>
      } />
      <Route path="/my-bookings" element={
        <ProtectedRoute>
          <MyBookings />
        </ProtectedRoute>
      } />
      <Route path="/halls" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Protected Admin Routes */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute requiresAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-requests" element={
        <ProtectedRoute requiresAdmin={true}>
          <AdminRequests />
        </ProtectedRoute>
      } />
      <Route path="/admin-halls" element={
        <ProtectedRoute requiresAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
