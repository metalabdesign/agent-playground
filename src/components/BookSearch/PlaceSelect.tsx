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

const POPULAR_PLACES = [
  { value: '_all', label: 'All Places' },
  { value: 'London', label: 'London' },
  { value: 'Paris', label: 'Paris' },
  { value: 'New York', label: 'New York' },
  { value: 'Tokyo', label: 'Tokyo' },
  { value: 'Rome', label: 'Rome' },
  { value: 'Berlin', label: 'Berlin' },
  { value: 'Moscow', label: 'Moscow' },
  { value: 'Sydney', label: 'Sydney' },
] as const;

export function PlaceSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPlace = searchParams.get('place') ?? '_all';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== '_all') {
      params.set('place', value);
    } else {
      params.delete('place');
    }
    params.delete('page'); // Reset pagination

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <Select value={currentPlace} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by place..." />
      </SelectTrigger>
      <SelectContent>
        {POPULAR_PLACES.map((place) => (
          <SelectItem key={place.value} value={place.value}>
            {place.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
