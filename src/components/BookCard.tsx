'use client';

import React from 'react';
import Image from 'next/image';
import { OpenLibraryDoc } from '@/src/lib/openLibrary/Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/shadcnui/card';

interface BookCardProps {
  book: OpenLibraryDoc;
}

export function BookCard({ book }: BookCardProps) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
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
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-4 text-center">
            No cover available
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base line-clamp-2" title={book.title}>
          {book.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="text-sm text-muted-foreground mb-1 line-clamp-1">
          {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
        </div>
        <div className="text-xs text-muted-foreground">
          {book.first_publish_year ? `First published: ${book.first_publish_year}` : 'Publish year unknown'}
        </div>
      </CardContent>
    </Card>
  );
}
