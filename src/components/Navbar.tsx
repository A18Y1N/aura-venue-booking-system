
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  Calendar, 
  Menu, 
  X,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <Calendar className="h-8 w-8 text-academy-blue mr-2" />
              <span className="font-bold text-xl text-academy-blue">SeminarHall</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-academy-text hover:text-academy-blue px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/my-bookings"
                className="text-academy-text hover:text-academy-blue px-3 py-2 text-sm font-medium"
              >
                My Bookings
              </Link>
              <Link
                to="/halls"
                className="text-academy-text hover:text-academy-blue px-3 py-2 text-sm font-medium"
              >
                Hall Directory
              </Link>
            </nav>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 border-l pl-4 ml-2">
                  <div className="bg-academy-blue text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-academy-text hover:text-academy-danger"
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
              className="text-academy-text"
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
            className="md:hidden bg-white overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-academy-text hover:bg-academy-background"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/my-bookings"
                className="block px-3 py-2 rounded-md text-base font-medium text-academy-text hover:bg-academy-background"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link
                to="/halls"
                className="block px-3 py-2 rounded-md text-base font-medium text-academy-text hover:bg-academy-background"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hall Directory
              </Link>
            </div>
            {user && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="bg-academy-blue text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-academy-text">{user.name}</div>
                    <div className="text-sm font-medium text-academy-muted">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left px-3 py-2 text-base font-medium text-academy-text hover:bg-academy-background"
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

export default Navbar;
