import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserRole } from "@/lib/constants";
import opqLogo from "../assets/opq-logo.png";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoading) {
      if (!user) {
        setLocation("/auth");
      } else if (user.role !== UserRole.ADMIN) {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, setLocation]);

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

  if (!user || user.role !== UserRole.ADMIN) {
    return null; // Will redirect due to useEffect
  }
  
  // Create a safe user object to prevent TypeScript errors
  const safeUser = user || { name: "", profileImageUrl: "", role: "" };

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
                    {safeUser.name.charAt(0) || "A"}
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              Admin Access
            </div>
          </div>

          <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
            <AlertTitle className="text-amber-800 font-medium">Admin Access Only</AlertTitle>
            <AlertDescription className="text-amber-700">
              This area is restricted to authorized administrators.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Administrator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safeUser.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  You have admin access to the system
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
