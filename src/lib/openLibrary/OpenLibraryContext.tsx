'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { OpenLibraryClient, openLibraryClient } from './Client';

const OpenLibraryContext = createContext<OpenLibraryClient | null>(null);

export function OpenLibraryProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => openLibraryClient, []);

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
