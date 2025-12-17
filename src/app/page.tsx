import { BooksHomepage } from "@/src/components/books/BooksHomepage";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <BooksHomepage />
        </Suspense>
      </main>
    </div>
  );
}
