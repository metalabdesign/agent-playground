'use client';

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useOpenLibrary } from '@/src/lib/openLibrary/context';
import { OpenLibraryClient } from '@/src/lib/openLibrary/Client';
import { DEFAULT_PAGE_LIMIT } from '@/src/lib/openLibrary/constants';
import type { BookDisplay, SortOption } from '@/src/lib/openLibrary/types';

export function useBookSearch() {
  const { client } = useOpenLibrary();
  const [isPending, startTransition] = useTransition();

  // URL-synced state with nuqs
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(''));
  const [place, setPlace] = useQueryState('place', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  // Local state for results
  const [books, setBooks] = useState<BookDisplay[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform search when params change
  useEffect(() => {
    const controller = new AbortController();

    async function performSearch() {
      // Build query with place filter
      const fullQuery = OpenLibraryClient.buildQueryWithPlace(query, place);

      if (!fullQuery) {
        setBooks([]);
        setTotalResults(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await client.search({
          q: fullQuery,
          sort: sort as SortOption,
          page,
          limit: DEFAULT_PAGE_LIMIT,
        });

        const displayBooks = response.docs.map(OpenLibraryClient.transformToDisplay);

        startTransition(() => {
          setBooks(displayBooks);
          setTotalResults(response.num_found);
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();

    return () => controller.abort();
  }, [client, query, sort, place, page]);

  // Reset page when filters change
  const handleQueryChange = useCallback((newQuery: string) => {
    setPage(1);
    setQuery(newQuery);
  }, [setQuery, setPage]);

  const handleSortChange = useCallback((newSort: string) => {
    setPage(1);
    setSort(newSort);
  }, [setSort, setPage]);

  const handlePlaceChange = useCallback((newPlace: string) => {
    setPage(1);
    setPlace(newPlace);
  }, [setPlace, setPage]);

  return {
    query,
    setQuery: handleQueryChange,
    sort,
    setSort: handleSortChange,
    place,
    setPlace: handlePlaceChange,
    page,
    setPage,
    books,
    totalResults,
    isLoading: isLoading || isPending,
    error,
  };
}
