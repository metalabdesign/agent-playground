"use client";

import * as React from "react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (nextPage: number) => void;
  className?: string;
};

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{pageCount}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

