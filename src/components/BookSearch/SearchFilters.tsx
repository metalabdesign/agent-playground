'use client';

import { Suspense } from 'react';
import { SearchInput } from './SearchInput';
import { SortSelect } from './SortSelect';
import { PlaceSelect } from './PlaceSelect';

export function SearchFilters() {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchInput />
      </Suspense>
      <div className="flex gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SortSelect />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <PlaceSelect />
        </Suspense>
      </div>
    </div>
  );
}
