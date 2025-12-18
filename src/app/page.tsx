import { BookSearch } from "@/src/components/BookSearch";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black p-8 md:p-24">
      <main className="w-full max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Open Library Explorer</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Search and discover books from the Open Library.
          </p>
        </div>
        
        <BookSearch />
      </main>
    </div>
  );
}
