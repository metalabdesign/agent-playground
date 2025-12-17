export interface SearchParams {
  q?: string;
  title?: string;
  author?: string;
  isbn?: string;
  subject?: string;
  place?: string;
  person?: string;
  publisher?: string;
  fields?: string;
  sort?: 'new' | 'old' | 'random' | 'key' | 'rating' | 'title' | '';
  lang?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export interface WorkDocument {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  cover_i?: number;
  edition_count?: number;
  language?: string[];
  subject?: string[];
  person?: string[];
  place?: string[];
  time?: string[];
  has_fulltext?: boolean;
  [key: string]: unknown;
}

export interface SearchResponse {
  start: number;
  num_found: number;
  numFound: number;
  numFoundExact?: boolean;
  docs: WorkDocument[];
  q?: string;
  offset?: number;
}
