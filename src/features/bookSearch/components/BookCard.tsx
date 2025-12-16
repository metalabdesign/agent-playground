import Image from 'next/image';
import { Card, CardContent } from '@/src/components/shadcnui/card';
import type { BookDisplay } from '@/src/lib/openLibrary/types';

interface BookCardProps {
  book: BookDisplay;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2/3] relative bg-muted">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No Cover
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {book.author}
        </p>
        {book.publishYear && (
          <p className="text-xs text-muted-foreground mt-1">
            {book.publishYear}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
