import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface AuthUser {
  user: User;
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/user"],
    retry: false,
  });

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
    error,
  };
}
