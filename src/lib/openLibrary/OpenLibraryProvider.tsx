"use client";

import React, { createContext, useContext, useMemo } from "react";
import { OpenLibraryClient } from "./Client";

type OpenLibraryContextValue = {
  client: OpenLibraryClient;
};

const OpenLibraryContext = createContext<OpenLibraryContextValue | null>(null);

export function OpenLibraryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ client: new OpenLibraryClient() }), []);
  return (
    <OpenLibraryContext.Provider value={value}>
      {children}
    </OpenLibraryContext.Provider>
  );
}

export function useOpenLibrary() {
  const ctx = useContext(OpenLibraryContext);
  if (!ctx) {
    throw new Error("useOpenLibrary must be used within OpenLibraryProvider");
  }
  return ctx;
}

