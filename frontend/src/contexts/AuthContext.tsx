"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiService, type User, type LoginRequest, type RegisterRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  demoGenerationsLeft: number;
  totalDemoGenerations: number;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  useDemoGeneration: () => void;
  resetDemoCount: () => void;
  updateNextAuthSession: (session: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_LIMIT = 2; // Allow 2 free demo generations
const DEMO_STORAGE_KEY = 'demo_generations_used';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [demoGenerationsUsed, setDemoGenerationsUsed] = useState(0);
  const [nextAuthSession, setNextAuthSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize demo count from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedDemoCount = localStorage.getItem(DEMO_STORAGE_KEY);
      if (savedDemoCount) {
        setDemoGenerationsUsed(parseInt(savedDemoCount, 10));
      }

      // Check for existing auth token
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Validate token with backend
        const userData = localStorage.getItem('user_data');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error('Failed to parse user data:', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        }
      }
      
      // Small delay to ensure NextAuth session is also loaded
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Set loading to false after initial setup
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // User is authenticated if they have either a local user account OR a NextAuth session
  const isAuthenticated = user !== null || nextAuthSession?.user != null;
  const demoGenerationsLeft = Math.max(0, DEMO_LIMIT - demoGenerationsUsed);
  const isDemoMode = !isAuthenticated && demoGenerationsLeft > 0;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.register({
        firstName,
        lastName,
        email,
        password,
        password_confirmation: password
      });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  };

  const useDemoGeneration = () => {
    if (!isAuthenticated && demoGenerationsLeft > 0) {
      const newCount = demoGenerationsUsed + 1;
      setDemoGenerationsUsed(newCount);
      localStorage.setItem(DEMO_STORAGE_KEY, newCount.toString());
    }
  };

  const resetDemoCount = () => {
    setDemoGenerationsUsed(0);
    localStorage.removeItem(DEMO_STORAGE_KEY);
  };

  const updateNextAuthSession = (session: any) => {
    setNextAuthSession(session);
    // If we're still loading and we get a session update, we can stop loading
    if (isLoading && session !== undefined) {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      demoGenerationsLeft,
      totalDemoGenerations: DEMO_LIMIT,
      isDemoMode,
      login,
      signup,
      logout,
      useDemoGeneration,
      resetDemoCount,
      updateNextAuthSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User };
