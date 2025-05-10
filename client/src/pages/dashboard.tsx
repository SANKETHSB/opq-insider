import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import opqLogo from "../assets/opq-logo.png";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);
  
  // Create a safe user object to prevent TypeScript errors
  const safeUser = user || { name: "", profileImageUrl: "" };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout", {});
      window.location.href = "/auth"; // Full page refresh to clear all states
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img 
                src={opqLogo} 
                alt="OPQ Bootcamp" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {safeUser.profileImageUrl ? (
                  <img 
                    src={safeUser.profileImageUrl} 
                    alt={safeUser.name} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {safeUser.name.charAt(0) || "U"}
                  </div>
                )}
                <span className="font-medium">{safeUser.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Welcome</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safeUser.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  You are logged in as a student
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
