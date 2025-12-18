'use client';

import { OpenLibraryBook } from '@/src/lib/openLibrary/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/shadcnui/card';
import Image from 'next/image';

interface BookCardProps {
  book: OpenLibraryBook;
}

export function BookCard({ book }: BookCardProps) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[2/3] w-full bg-muted">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            No Cover
          </div>
        )}
      </div>
      <CardHeader className="flex-1">
        <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
        <CardDescription className="line-clamp-1">
          {book.author_name?.join(', ') || 'Unknown Author'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {book.first_publish_year && (
          <p className="text-xs text-muted-foreground">
            First published: {book.first_publish_year}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
