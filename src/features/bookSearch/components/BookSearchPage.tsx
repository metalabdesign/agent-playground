'use client';

import { useBookSearch } from '../hooks/useBookSearch';
import { SearchBar } from './SearchBar';
import { SortDropdown } from './SortDropdown';
import { PlaceDropdown } from './PlaceDropdown';
import { BookGrid } from './BookGrid';
import { SearchPagination } from './SearchPagination';

export function BookSearchPage() {
  const {
    query,
    setQuery,
    sort,
    setSort,
    place,
    setPlace,
    page,
    setPage,
    books,
    totalResults,
    isLoading,
    error,
  } = useBookSearch();

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex gap-2">
          <SortDropdown value={sort} onChange={setSort} />
          <PlaceDropdown value={place} onChange={setPlace} />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      <BookGrid books={books} isLoading={isLoading} />

      {/* Pagination */}
      {totalResults > 0 && (
        <SearchPagination
          currentPage={page}
          totalResults={totalResults}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
