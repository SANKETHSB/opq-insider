import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";
import AdminLoginForm from "@/components/admin-login-form";

interface AuthFormProps {
  consoleType: "student" | "admin";
  authMode: "login" | "register";
  onToggleMode: () => void;
}

export default function AuthForm({ consoleType, authMode, onToggleMode }: AuthFormProps) {
  // Used for animation
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Update key to trigger animation
    setKey(prev => prev + 1);
  }, [consoleType, authMode]);

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          className="w-full"
        >
          {consoleType === "student" && authMode === "login" && (
            <LoginForm />
          )}

          {consoleType === "student" && authMode === "register" && (
            <RegisterForm />
          )}

          {consoleType === "admin" && (
            <AdminLoginForm />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Text */}
      {consoleType === "student" && (
        <div className="mt-8 text-center text-sm text-gray-600">
          {authMode === "login" ? (
            <p>Don't have an account? <button onClick={onToggleMode} className="font-medium text-primary hover:text-primary/80">Register now</button></p>
          ) : (
            <p>Already have an account? <button onClick={onToggleMode} className="font-medium text-primary hover:text-primary/80">Sign in</button></p>
          )}
        </div>
      )}
    </>
  );
}
