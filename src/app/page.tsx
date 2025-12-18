import { BookSearch } from "@/src/components/BookSearch";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Open Library Explorer</h1>
        <p className="text-muted-foreground text-center">Search for books across the globe</p>
      </div>
      <Suspense fallback={<div className="text-center">Loading search...</div>}>
        <BookSearch />
      </Suspense>
    </main>
  );
}
