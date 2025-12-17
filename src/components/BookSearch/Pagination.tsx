'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/src/components/shadcnui/button';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
}

export function Pagination({ currentPage, totalResults, resultsPerPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
      >
        Previous
      </Button>

      <span className="px-4 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
      >
        Next
      </Button>
    </div>
  );
}
