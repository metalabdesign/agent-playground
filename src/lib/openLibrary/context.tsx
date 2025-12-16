'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { OpenLibraryClient } from './Client';

interface OpenLibraryContextValue {
  client: OpenLibraryClient;
}

const OpenLibraryContext = createContext<OpenLibraryContextValue | null>(null);

interface OpenLibraryProviderProps {
  children: ReactNode;
  baseUrl?: string;
}

export function OpenLibraryProvider({
  children,
  baseUrl
}: OpenLibraryProviderProps) {
  const client = useMemo(() => new OpenLibraryClient(baseUrl), [baseUrl]);

  const value = useMemo(() => ({ client }), [client]);

  return (
    <OpenLibraryContext.Provider value={value}>
      {children}
    </OpenLibraryContext.Provider>
  );
}

export function useOpenLibrary(): OpenLibraryContextValue {
  const context = useContext(OpenLibraryContext);

  if (!context) {
    throw new Error('useOpenLibrary must be used within an OpenLibraryProvider');
  }

  return context;
}

// Re-export types and utilities for convenient imports
export { OpenLibraryClient } from './Client';
export * from './types';
export * from './constants';
