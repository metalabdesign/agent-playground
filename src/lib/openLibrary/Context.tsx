'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { OpenLibraryClient } from './Client';

const OpenLibraryContext = createContext<OpenLibraryClient | null>(null);

export function OpenLibraryProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => new OpenLibraryClient(), []);

  return (
    <OpenLibraryContext.Provider value={client}>
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
