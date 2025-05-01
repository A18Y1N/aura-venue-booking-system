import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AuthDisplay = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-academy-blue to-academy-light-blue text-white">
      <header className="p-6">
        <h1 className="text-3xl font-bold">Seminar Hall Booking System</h1>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome</h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100">
            Streamline your seminar hall bookings with our easy-to-use platform
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-8 relative overflow-hidden"
            onMouseEnter={() => setHoveredButton("login")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <h3 className="text-2xl font-semibold mb-4">Existing User?</h3>
            <p className="mb-6">Sign in to your account to manage your hall bookings</p>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => handleNavigate('/login')}
                className="bg-academy-accent text-academy-text hover:bg-opacity-90 flex items-center gap-2"
              >
                User Login
                <ArrowRight size={18} />
              </Button>
              
              <Button 
                onClick={() => handleNavigate('/admin-login')}
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/20"
              >
                Admin Login
              </Button>
            </div>
            
            {hoveredButton === "login" && (
              <motion.div 
                className="absolute inset-0 bg-white/5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-8 relative overflow-hidden"
            onMouseEnter={() => setHoveredButton("register")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <h3 className="text-2xl font-semibold mb-4">New User?</h3>
            <p className="mb-6">Create an account to start booking seminar halls</p>
            
            <Button 
              onClick={() => handleNavigate('/register')}
              className="bg-white text-academy-blue hover:bg-gray-100 flex items-center gap-2"
            >
              Register Now
              <ArrowRight size={18} />
            </Button>
            
            {hoveredButton === "register" && (
              <motion.div 
                className="absolute inset-0 bg-white/5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        </div>
      </main>
      
      <footer className="p-6 text-center text-sm text-white/70">
        &copy; {new Date().getFullYear()} Seminar Hall Booking System. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthDisplay;
