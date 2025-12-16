// API Response Types
export interface OpenLibrarySearchResponse {
  start: number;
  num_found: number;
  numFound: number; // API returns both formats
  docs: OpenLibraryBook[];
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  ia?: string[];
  isbn?: string[];
  subject?: string[];
  place?: string[];
  publisher?: string[];
  language?: string[];
}

// Search Parameters
export type SortOption = 'new' | 'old' | 'rating' | 'title' | 'random' | '';

export interface SearchParams {
  q: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

// Derived/Display Types
export interface BookDisplay {
  id: string;
  title: string;
  author: string;
  publishYear: number | null;
  coverUrl: string | null;
}
