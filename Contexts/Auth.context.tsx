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
    // 1. Immediately clear user and session state (instant 0ms UI update)
    setUser(null);
    setSession(null);

    // 2. Immediately clear all Supabase and session tokens from storage & cookies
    if (typeof window !== 'undefined') {
      try {
        const localKeys = Object.keys(localStorage);
        localKeys.forEach((key) => {
          if (key.startsWith('sb-') || key.includes('supabase') || key.includes('user') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });

        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach((key) => {
          if (key.startsWith('sb-') || key.includes('supabase') || key.includes('user') || key.includes('auth')) {
            sessionStorage.removeItem(key);
          }
        });

        // Expire auth cookies
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
        document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      } catch (storageErr) {
        console.error('Error clearing storage on logout:', storageErr);
      }
    }

    // 3. Reset local Supabase client state with a fast 250ms timeout safety race (never hangs)
    try {
      await Promise.race([
        mysupabase.auth.signOut({ scope: 'local' }),
        new Promise((resolve) => setTimeout(resolve, 250)),
      ]);
    } catch (localErr) {
      console.warn('Local signOut error:', localErr);
    }

    // 4. Background fire-and-forget notification to Supabase server (never blocks user)
    mysupabase.auth.signOut().catch(() => {});
  };

  const syncAuthCookie = (token?: string | null) => {
    if (typeof document === 'undefined') return;
    if (token) {
      document.cookie = `sb-access-token=${token}; path=/; max-age=604800; SameSite=Lax;`;
    } else {
      document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
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
        syncAuthCookie(initialSession.access_token);
      } else {
        setSession(null);
        setUser(null);
        syncAuthCookie(null);
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
      syncAuthCookie(newSession?.access_token || null);
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
