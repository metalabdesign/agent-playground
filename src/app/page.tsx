import { Suspense } from "react";
import { OpenLibrarySearchPage } from "@/src/app/search/OpenLibrarySearchPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-muted-foreground">
            Loading…
          </div>
        </div>
      }
    >
      <OpenLibrarySearchPage />
    </Suspense>
  );
}

