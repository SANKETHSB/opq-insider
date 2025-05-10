import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AuthLayout from "@/components/auth-layout";
import AuthForm from "@/components/auth-form";
import { useAuth } from "@/hooks/use-auth";
import opqLogo from "../assets/opq-logo.png";

type ConsoleType = "student" | "admin";
type AuthMode = "login" | "register";

export default function Auth() {
  const [consoleType, setConsoleType] = useState<ConsoleType>("student");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if already logged in
    if (!isLoading && user) {
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, setLocation]);
  
  // Create a safe user object to prevent TypeScript errors
  const safeUser = user || { role: "" };

  const handleConsoleChange = (type: ConsoleType) => {
    setConsoleType(type);
    // Reset to login mode when switching to admin console
    if (type === "admin") {
      setAuthMode("login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="flex items-center justify-center mb-8 md:hidden">
          <img 
            src={opqLogo} 
            alt="OPQ Bootcamp" 
            className="h-14 w-auto pulse-effect"
          />
        </div>

        {/* Console Type Tabs */}
        <div className="mb-8">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center font-medium relative ${
                consoleType === "student"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
              onClick={() => handleConsoleChange("student")}
            >
              Student Console
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium relative ${
                consoleType === "admin"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
              onClick={() => handleConsoleChange("admin")}
            >
              Admin Console
            </button>
          </div>
        </div>

        {/* Auth Modes (Only for Student Console) */}
        {consoleType === "student" && (
          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`flex-1 py-2 text-center font-medium relative ${
                  authMode === "login"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 text-center font-medium relative ${
                  authMode === "register"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Auth Forms */}
        <AuthForm
          consoleType={consoleType}
          authMode={authMode}
          onToggleMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
        />
      </div>
    </AuthLayout>
  );
}
