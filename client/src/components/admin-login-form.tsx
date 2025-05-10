import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { LoginInput, loginSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/login", data);
      const result = await response.json();
      
      if (result.user) {
        if (result.user.role === "admin") {
          setLocation("/admin");
        } else {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You don't have administrator privileges.",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Console</h2>
        <p className="text-gray-600">Access administrator dashboard</p>
      </div>

      {/* Admin Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      placeholder="admin@example.com" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center">
            <Checkbox id="remember-me" />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-5"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in to Admin Console"}
          </Button>
        </form>
      </Form>

      <Alert className="mt-6 bg-amber-50 border border-amber-200 text-amber-800">
        <FiAlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-800 font-medium">Admin Access Only</AlertTitle>
        <AlertDescription className="text-amber-700 text-sm">
          This area is restricted to authorized administrators. If you're a student, please use the Student Console.
        </AlertDescription>
      </Alert>
    </div>
  );
}
