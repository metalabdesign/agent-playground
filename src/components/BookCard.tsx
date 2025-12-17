import { WorkDocument } from '@/src/lib/openLibrary';
import { Card, CardContent } from '@/src/components/shadcnui/card';
import Image from 'next/image';

interface BookCardProps {
  book: WorkDocument;
}

export function BookCard({ book }: BookCardProps) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const authors = book.author_name?.join(', ') || 'Unknown Author';

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                width={100}
                height={150}
                className="rounded object-cover"
              />
            ) : (
              <div className="w-[100px] h-[150px] bg-muted rounded flex items-center justify-center text-muted-foreground text-xs text-center px-2">
                No Cover
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-2 mb-2">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">{authors}</p>
            {book.first_publish_year && (
              <p className="text-sm text-muted-foreground">
                {book.first_publish_year}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
