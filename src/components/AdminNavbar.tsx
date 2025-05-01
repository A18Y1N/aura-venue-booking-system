
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  Calendar, 
  Menu, 
  X,
  User,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-academy-blue text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin-dashboard" className="flex items-center">
              <ShieldCheck className="h-7 w-7 text-white mr-2" />
              <div>
                <span className="font-bold text-xl">SeminarHall</span>
                <span className="text-xs bg-white text-academy-blue px-2 py-0.5 ml-2 rounded-full">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              <Link
                to="/admin-dashboard"
                className="flex items-center text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Dashboard
              </Link>
              <Link
                to="/admin-requests"
                className="flex items-center text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Clock className="h-4 w-4 mr-1.5" />
                Pending Requests
              </Link>
              <Link
                to="/admin-halls"
                className="flex items-center text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Building className="h-4 w-4 mr-1.5" />
                Manage Halls
              </Link>
            </nav>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 border-l border-white/20 pl-4 ml-2">
                  <div className="bg-white text-academy-blue rounded-full w-8 h-8 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-academy-light-blue overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/admin-dashboard"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/admin-requests"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Clock className="h-5 w-5 mr-2" />
                Pending Requests
              </Link>
              <Link
                to="/admin-halls"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building className="h-5 w-5 mr-2" />
                Manage Halls
              </Link>
            </div>
            {user && (
              <div className="pt-4 pb-3 border-t border-white/20">
                <div className="flex items-center px-5">
                  <div className="bg-white text-academy-blue rounded-full w-8 h-8 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.name}</div>
                    <div className="text-sm font-medium text-white/60">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminNavbar;
