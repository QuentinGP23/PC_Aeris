import { useEffect, useState, type ReactNode } from "react";
import { authService } from "../services";
import type { User, SignUpData, SignInData } from "../types";
import { AuthContext, type AuthContextType } from "./AuthContextType";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    const initAuth = async () => {
      const { user } = await authService.getSession();
      setUser(user);
      setIsLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    const { user, error } = await authService.signUp(data);
    if (user) setUser(user);
    setIsLoading(false);
    return { error };
  };

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    const { user, error } = await authService.signIn(data);
    if (user) setUser(user);
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await authService.signOut();
    if (!error) setUser(null);
    setIsLoading(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    return authService.updatePassword(newPassword);
  };

  const updateProfile = async (data: Partial<User>) => {
    const { error } = await authService.updateProfile(data);
    if (!error && user) {
      setUser({ ...user, ...data });
    }
    return { error };
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
