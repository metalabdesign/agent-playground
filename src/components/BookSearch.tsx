'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useOpenLibrary } from '@/src/lib/openLibrary/OpenLibraryContext';
import { OpenLibrarySearchResponse, OpenLibrarySearchParams } from '@/src/lib/openLibrary/Client';
import { Input } from '@/src/components/shadcnui/input';
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
import { BookCard } from '@/src/components/BookCard';
import { Skeleton } from '@/src/components/shadcnui/skeleton';
import { Loader2, Search, XCircle } from 'lucide-react';

const PLACES = [
  { label: 'All Places', value: 'all' },
  { label: 'London', value: 'London' },
  { label: 'New York', value: 'New York' },
  { label: 'Paris', value: 'Paris' },
  { label: 'Tokyo', value: 'Tokyo' },
  { label: 'Berlin', value: 'Berlin' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest', value: 'new' },
  { label: 'Oldest', value: 'old' },
  { label: 'Rating', value: 'rating' },
  { label: 'Title', value: 'title' },
  { label: 'Random', value: 'random' },
];

export function BookSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const client = useOpenLibrary();

  // Initialize state from URL
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<OpenLibrarySearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update URL function
  const updateUrl = useCallback((params: Record<string, string | number | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'all' || (key === 'page' && value === 1)) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value.toString());
      }
    });

    router.push(`${pathname}?${newSearchParams.toString()}`);
  }, [pathname, router, searchParams]);

  // Debounced query update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) {
        updateUrl({ q: query, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, initialQuery, updateUrl]);

  // Fetch results when searchParams change
  const handleSearch = useCallback(async () => {
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'relevance';
    const place = searchParams.get('place') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!q && place === 'all') {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let searchQuery = q;
      if (place !== 'all') {
        searchQuery = searchQuery ? `${searchQuery} place:"${place}"` : `place:"${place}"`;
      }

      const params: OpenLibrarySearchParams = {
        q: searchQuery || undefined,
        sort: sort === 'relevance' ? undefined : sort,
        page,
        limit: 20,
      };

      const response = await client.search(params);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching books.');
    } finally {
      setLoading(false);
    }
  }, [client, searchParams]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const totalPages = results ? Math.ceil(results.numFound / 20) : 0;
  const page = parseInt(searchParams.get('page') || '1', 10);

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 sticky top-4 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-xl border shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select 
            value={searchParams.get('sort') || 'relevance'} 
            onValueChange={(value) => updateUrl({ sort: value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select 
            value={searchParams.get('place') || 'all'} 
            onValueChange={(value) => updateUrl({ place: value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by place" />
            </SelectTrigger>
            <SelectContent>
              {PLACES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-destructive">
          <XCircle className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => handleSearch()}
            className="mt-4 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && !results && (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-xl">Start searching for your favorite books</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : (
          results?.docs.map((doc) => (
            <BookCard key={doc.key} book={doc} />
          ))
        )}
      </div>

      {!loading && results?.docs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No books found for this search.</p>
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) updateUrl({ page: page - 1 });
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages.toLocaleString()}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) updateUrl({ page: page + 1 });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {loading && results && (
        <div className="fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg animate-bounce">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}