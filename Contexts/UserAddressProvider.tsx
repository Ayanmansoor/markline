'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { AddressProps } from "@/types/interfaces";
import { useAuth } from "./Auth.context";

interface UserAddressContextProps {
  addresses: AddressProps[];
  selectedAddress: AddressProps | null;
  setSelectedAddress: (addr: AddressProps | null) => void;
  loading: boolean;
  isLoaded: boolean;
  refreshAddresses: () => Promise<void>;
  addAddress: (newAddr: AddressProps) => void;
  updateAddressInState: (updatedAddr: AddressProps) => void;
  removeAddressFromState: (id: string | number) => void;
}

const UserAddressContext = createContext<UserAddressContextProps>({
  addresses: [],
  selectedAddress: null,
  setSelectedAddress: () => {},
  loading: false,
  isLoaded: false,
  refreshAddresses: async () => {},
  addAddress: () => {},
  updateAddressInState: () => {},
  removeAddressFromState: () => {},
});

export const UserAddressProvider = ({
  children,
  initialAddresses = [],
}: {
  children: ReactNode;
  initialAddresses?: AddressProps[];
}) => {
  const { user, isAuthLoading } = useAuth();

  // Initialize with server-fetched addresses directly (0ms wait, instant hydration)
  const [addresses, setAddresses] = useState<AddressProps[]>(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState<AddressProps | null>(() => {
    if (initialAddresses && initialAddresses.length > 0) {
      return initialAddresses.find((a: any) => a.is_selected === true) || initialAddresses[0];
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(initialAddresses.length > 0);
  const hasHydratedServerData = useRef(initialAddresses.length > 0);

  // Client-side fetch helper for dynamic updates or fresh sign-ins
  const fetchAddresses = useCallback(async (userId?: string) => {
    const targetUid = userId || user?.id;
    if (!targetUid) {
      setAddresses([]);
      setSelectedAddress(null);
      setIsLoaded(true);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await mysupabase
        .from("address")
        .select("*")
        .eq("user_id", targetUid)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[UserAddressProvider] Error fetching addresses:", error.message);
        setAddresses([]);
      } else {
        const fetched = data || [];
        setAddresses(fetched);

        if (fetched.length > 0) {
          const defaultAddr = fetched.find((a: any) => a.is_selected === true) || fetched[0];
          setSelectedAddress(defaultAddr);
        } else {
          setSelectedAddress(null);
        }
      }
    } catch (err) {
      console.error("[UserAddressProvider] Unexpected error:", err);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthLoading) return;

    // If we already received addresses from server, skip duplicate fetch on initial mount
    if (hasHydratedServerData.current && user?.id) {
      hasHydratedServerData.current = false;
      return;
    }

    if (user?.id) {
      fetchAddresses(user.id);
    } else {
      setAddresses([]);
      setSelectedAddress(null);
      setIsLoaded(true);
    }
  }, [user?.id, isAuthLoading, fetchAddresses]);

  // Optimistic helpers for instant local state modification
  const addAddress = useCallback((newAddr: AddressProps) => {
    if (!newAddr) return;
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === newAddr.id);
      if (exists) {
        return prev.map((a) => (a.id === newAddr.id ? newAddr : a));
      }
      return [newAddr, ...prev];
    });
    setSelectedAddress(newAddr);
  }, []);

  const updateAddressInState = useCallback((updatedAddr: AddressProps) => {
    if (!updatedAddr) return;
    setAddresses((prev) => prev.map((a) => (a.id === updatedAddr.id ? updatedAddr : a)));
    setSelectedAddress((prev) => (prev?.id === updatedAddr.id ? updatedAddr : prev));
  }, []);

  const removeAddressFromState = useCallback((id: string | number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setSelectedAddress((prev) => (prev?.id === id ? null : prev));
  }, []);

  const refreshAddresses = useCallback(async () => {
    await fetchAddresses(user?.id);
  }, [fetchAddresses, user?.id]);

  return (
    <UserAddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        loading,
        isLoaded,
        refreshAddresses,
        addAddress,
        updateAddressInState,
        removeAddressFromState,
      }}
    >
      {children}
    </UserAddressContext.Provider>
  );
};

export const useUserAddress = () => useContext(UserAddressContext);
