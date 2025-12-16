import type { BookDisplay } from '@/src/lib/openLibrary/types';
import { BookCard } from './BookCard';
import { BookCardSkeleton } from './BookCardSkeleton';
import { DEFAULT_PAGE_LIMIT } from '@/src/lib/openLibrary/constants';

interface BookGridProps {
  books: BookDisplay[];
  isLoading: boolean;
}

export function BookGrid({ books, isLoading }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: DEFAULT_PAGE_LIMIT }).map((_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No books found. Try a different search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
