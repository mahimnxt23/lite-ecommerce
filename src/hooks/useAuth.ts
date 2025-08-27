import { useAuthStore } from "@/store/auth";

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  return { user, isAuthenticated, setUser, logout };
};
