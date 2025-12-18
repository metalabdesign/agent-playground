export interface OpenLibrarySearchOptions {
  q?: string;
  title?: string;
  author?: string;
  subject?: string;
  isbn?: string;
  place?: string;
  person?: string;
  publisher?: string;
  lang?: string;
  sort?: 'new' | 'old' | 'rating' | 'title' | 'random' | 'key';
  page?: number;
  limit?: number;
  fields?: string;
  offset?: number;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  publisher?: string[];
  language?: string[];
  subject?: string[];
  [key: string]: any;
}

export interface OpenLibrarySearchResponse {
  start: number;
  num_found: number;
  docs: OpenLibraryBook[];
}
