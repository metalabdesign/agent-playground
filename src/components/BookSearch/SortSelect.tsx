'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/shadcnui/select';

const SORT_OPTIONS = [
  { value: '_relevance', label: 'Relevance' },
  { value: 'new', label: 'Newest First' },
  { value: 'old', label: 'Oldest First' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title' },
  { value: 'random', label: 'Random' },
] as const;

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get('sort') ?? '_relevance';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== '_relevance') {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <Select value={currentSort} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
