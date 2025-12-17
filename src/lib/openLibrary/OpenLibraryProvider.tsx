'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { OpenLibraryClient } from './Client';

const OpenLibraryContext = createContext<OpenLibraryClient | null>(null);

export function OpenLibraryProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => new OpenLibraryClient(), []);

  return (
    <OpenLibraryContext.Provider value={client}>
      {children}
    </OpenLibraryContext.Provider>
  );
}

export function useOpenLibrary(): OpenLibraryClient {
  const context = useContext(OpenLibraryContext);
  if (!context) {
    throw new Error('useOpenLibrary must be used within OpenLibraryProvider');
  }
  return context;
}
