import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Building,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-academy-blue text-white flex flex-col p-4">
        <div className="mb-8 flex items-center">
          <ShieldCheck className="w-6 h-6 mr-2" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin-requests"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <Clock className="w-4 h-4" />
            Pending Requests
          </NavLink>

          <NavLink
            to="/admin-halls"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <Building className="w-4 h-4" />
            Manage Halls
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-white/20 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">{user?.name}</div>
              <div className="text-xs text-white/70">{user?.email}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
