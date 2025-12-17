"use client";

import React, { createContext, useContext, useMemo } from "react";

import { OpenLibraryClient, type OpenLibraryClientConfig } from "./Client";

const OpenLibraryClientContext = createContext<OpenLibraryClient | null>(null);

export type OpenLibraryProviderProps = {
  children: React.ReactNode;
  clientConfig?: OpenLibraryClientConfig;
};

export function OpenLibraryProvider({
  children,
  clientConfig,
}: OpenLibraryProviderProps) {
  const client = useMemo(() => new OpenLibraryClient(clientConfig), [clientConfig]);

  return (
    <OpenLibraryClientContext.Provider value={client}>
      {children}
    </OpenLibraryClientContext.Provider>
  );
}

export function useOpenLibraryClient(): OpenLibraryClient {
  const client = useContext(OpenLibraryClientContext);
  if (!client) {
    throw new Error("useOpenLibraryClient must be used within OpenLibraryProvider");
  }
  return client;
}

