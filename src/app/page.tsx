import { Suspense } from 'react';
import { OpenLibraryProvider } from '@/src/lib/openLibrary/Context';
import BookSearch from '@/src/components/BookSearch/BookSearch';

export default function Home() {
  return (
    <OpenLibraryProvider>
      <main className="min-h-screen bg-background">
        <Suspense fallback={<div className="container mx-auto p-4">Loading search...</div>}>
          <BookSearch />
        </Suspense>
      </main>
    </OpenLibraryProvider>
  );
}