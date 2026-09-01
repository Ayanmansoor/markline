'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from 'react-query';
import { getAllCollectionsBaseOnType } from '@/Supabase/SupabaseApi';

interface CollectionsContextType {
  collections: any[];
  isLoading: boolean;
  isError: boolean;
}

const CollectionsContext = createContext<CollectionsContextType>({
  collections: [],
  isLoading: true,
  isError: false,
});

export const CollectionsProvider = ({ children }: { children: ReactNode }) => {
  const { data: collections = [], isLoading, isError } = useQuery<any>({
    queryKey: ['global_collections', 'ALL'],
    queryFn: () => getAllCollectionsBaseOnType('ALL'),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <CollectionsContext.Provider value={{ collections, isLoading, isError }}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => useContext(CollectionsContext);
