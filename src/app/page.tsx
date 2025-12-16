import { BookSearchPage } from '@/src/features/bookSearch/components/BookSearchPage';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Search</h1>
      <BookSearchPage />
    </main>
  );
}
