'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useOpenLibrary } from '@/src/lib/openLibrary';
import { OpenLibraryBook, OpenLibrarySearchResponse } from '@/src/lib/openLibrary/types';
import { Input } from '@/src/components/shadcnui/input';
import { Button } from '@/src/components/shadcnui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/shadcnui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/src/components/shadcnui/pagination';
import { BookCard } from './BookCard';

const PLACES = [
  { label: 'Any Place', value: 'any' },
  { label: 'London', value: 'London' },
  { label: 'Paris', value: 'Paris' },
  { label: 'New York', value: 'New York' },
  { label: 'Rome', value: 'Rome' },
  { label: 'Tokyo', value: 'Tokyo' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest', value: 'new' },
  { label: 'Oldest', value: 'old' },
  { label: 'Rating', value: 'rating' },
  { label: 'Title', value: 'title' },
  { label: 'Random', value: 'random' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const client = useOpenLibrary();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [place, setPlace] = useState(searchParams.get('place') || 'any');
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<OpenLibrarySearchResponse | null>(null);

  const updateQueryParams = useCallback((updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === 'any' || value === 'relevance' || (key === 'page' && value === 1)) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const performSearch = useCallback(async (currentQuery: string, currentPlace: string, currentSort: string, currentPage: number) => {
    if (!currentQuery && currentPlace === 'any') {
      setResponse(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let finalQ = currentQuery;
      if (currentPlace !== 'any') {
        finalQ = `${currentQuery} place:${currentPlace}`.trim();
      }

      const options: any = {
        q: finalQ || undefined,
        sort: currentSort === 'relevance' ? undefined : currentSort,
        page: currentPage,
        limit: 12,
      };

      const res = await client.search(options);
      setResponse(res);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Initial search and URL sync
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const pl = searchParams.get('place') || 'any';
    const s = searchParams.get('sort') || 'relevance';
    const p = Number(searchParams.get('page')) || 1;

    setQuery(q);
    setPlace(pl);
    setSort(s);
    setPage(p);

    performSearch(q, pl, s, p);
  }, [searchParams, performSearch]);

  const handleSearchClick = () => {
    updateQueryParams({ q: query, place, sort, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ q: query, place, sort, page: newPage });
  };

  const handlePlaceChange = (newPlace: string) => {
    updateQueryParams({ q: query, place: newPlace, sort, page: 1 });
  };

  const handleSortChange = (newSort: string) => {
    updateQueryParams({ q: query, place, sort: newSort, page: 1 });
  };

  const totalPages = response ? Math.ceil(response.num_found / 12) : 0;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Search Books</label>
          <Input
            placeholder="Search by title, author, etc..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          />
        </div>
        
        <div className="w-full md:w-[200px] space-y-2">
          <label className="text-sm font-medium">Place</label>
          <Select value={place} onValueChange={handlePlaceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a place" />
            </SelectTrigger>
            <SelectContent>
              {PLACES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[200px] space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearchClick} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        {response && !loading && (
          <p className="text-sm text-muted-foreground">
            Found {response.num_found} books
          </p>
        )}

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {response?.docs.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
        )}

        {!loading && response?.docs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching your search.</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              <PaginationItem>
                <span className="px-4 text-sm">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export function BookSearch() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
