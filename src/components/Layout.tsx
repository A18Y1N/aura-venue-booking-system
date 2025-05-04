import { useAuth } from "@/contexts/AuthContext";
import AdminNavbar from "./AdminNavbar";
import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-academy-background">
      {user?.role === "admin" ? <AdminNavbar /> : <Navbar />}
      <main className="pt-4">{children}</main>
    </div>
  );
};

export default Layout;
