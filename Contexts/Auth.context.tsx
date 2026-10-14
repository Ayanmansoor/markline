'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const { data: { session: currentSession } } = await mysupabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    } catch (err) {
      console.error('Error refreshing session:', err);
    }
  };

  const logout = async () => {
    try {
      await mysupabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Instant session hydration from local cache (0ms latency)
    mysupabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    }).catch((err) => {
      if (!isMounted) return;
      console.error('Auth getSession error:', err);
      setLoading(false);
    });

    // 2. Real-time auth state listener (cross-tab sync, login, logout, token refresh)
    const { data: { subscription } } = mysupabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthLoading: loading,
        isAuthenticated: !!user,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
