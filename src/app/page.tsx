import { Suspense } from 'react';
import { OpenLibraryClient } from '@/src/lib/openLibrary';
import { SearchFilters, Pagination } from '@/src/components/BookSearch';
import { BookCard } from '@/src/components/BookCard';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    place?: string;
    page?: string;
  }>;
}

const RESULTS_PER_PAGE = 20;

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { q, sort, place, page } = params;

  const currentPage = page ? parseInt(page, 10) : 1;
  const offset = (currentPage - 1) * RESULTS_PER_PAGE;

  // Build search query - append place to q if specified
  let searchQuery = q || '';
  if (place) {
    searchQuery = searchQuery ? `${searchQuery} place:${place}` : `place:${place}`;
  }

  // Only fetch if there's a search query or place filter
  let results = null;
  let error = null;
  if (searchQuery) {
    const client = new OpenLibraryClient();

    try {
      results = await client.search({
        q: searchQuery,
        sort: sort as 'new' | 'old' | 'random' | 'key' | 'rating' | 'title' | '' | undefined,
        limit: RESULTS_PER_PAGE,
        offset,
      });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch books';
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Book Search</h1>

        <Suspense fallback={<div>Loading filters...</div>}>
          <SearchFilters />
        </Suspense>

        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive font-medium mb-2">Error loading books</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : results ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Found {results.numFound.toLocaleString()} results
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {results.docs.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>

            <Suspense fallback={null}>
              <Pagination
                currentPage={currentPage}
                totalResults={results.numFound}
                resultsPerPage={RESULTS_PER_PAGE}
              />
            </Suspense>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Enter a search term or select a place to find books.
          </div>
        )}
      </main>
    </div>
  );
}
