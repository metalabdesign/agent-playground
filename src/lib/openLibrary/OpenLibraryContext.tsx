'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { OpenLibraryClient } from './Client';

const OpenLibraryContext = createContext<OpenLibraryClient | null>(null);

interface OpenLibraryProviderProps {
  children: React.ReactNode;
  client?: OpenLibraryClient;
}

export function OpenLibraryProvider({ children, client }: OpenLibraryProviderProps) {
  const openLibraryClient = useMemo(() => {
    return client || new OpenLibraryClient();
  }, [client]);

  return (
    <OpenLibraryContext.Provider value={openLibraryClient}>
      {children}
    </OpenLibraryContext.Provider>
  );
}

export function useOpenLibrary() {
  const context = useContext(OpenLibraryContext);
  if (!context) {
    throw new Error('useOpenLibrary must be used within an OpenLibraryProvider');
  }
  return context;
}
