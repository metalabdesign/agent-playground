"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";

import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

export type BookCardProps = {
  title: string;
  author: string;
  firstPublishYear?: number;
  coverUrl?: string;
  className?: string;
};

export function BookCard({
  title,
  author,
  firstPublishYear,
  coverUrl,
  className,
}: BookCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative aspect-[2/3] w-full bg-muted">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={title}
            src={coverUrl}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <BookOpen className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>
      <CardContent className="space-y-1 p-4">
        <div className="text-sm font-medium leading-snug">{title || "Untitled"}</div>
        <div className="truncate text-sm text-muted-foreground">{author || "Unknown author"}</div>
        {firstPublishYear ? (
          <div className="text-xs text-muted-foreground">First published {firstPublishYear}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}

