import type { SortOption } from './types';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'new', label: 'Newest First' },
  { value: 'old', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'random', label: 'Random' },
];

export const PLACES = [
  { value: 'New York', label: 'New York' },
  { value: 'London', label: 'London' },
  { value: 'Paris', label: 'Paris' },
  { value: 'Tokyo', label: 'Tokyo' },
  { value: 'Rome', label: 'Rome' },
  { value: 'Berlin', label: 'Berlin' },
  { value: 'Sydney', label: 'Sydney' },
  { value: 'Moscow', label: 'Moscow' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Beijing', label: 'Beijing' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'San Francisco', label: 'San Francisco' },
] as const;

export const DEFAULT_PAGE_LIMIT = 20;
export const COVER_BASE_URL = 'https://covers.openlibrary.org/b/id';
export const SEARCH_API_URL = 'https://openlibrary.org/search.json';
