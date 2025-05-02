import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { IUser } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("seminar-hall-user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post<{ token: string; user: IUser }>(
        "/api/auth/login",
        { email, password }
      );
      const { token, user } = res.data;

      localStorage.setItem("seminar-hall-user", JSON.stringify(user));
      localStorage.setItem("seminar-hall-token", token);

      setUser(user);
      toast.success(`Welcome, ${user.name}!`);
      return true;
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ?? "Login failed";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post<{ message: string }>(
        "/api/auth/register",
        { name, email, password, role }
      );
      toast.success(res.data.message || "Registration successful.");
      return true;
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ?? "Registration failed";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("seminar-hall-user");
    localStorage.removeItem("seminar-hall-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
