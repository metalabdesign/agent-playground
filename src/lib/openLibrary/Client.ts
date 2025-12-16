import type {
  OpenLibrarySearchResponse,
  OpenLibraryBook,
  BookDisplay,
  SearchParams,
} from './types';
import { SEARCH_API_URL, COVER_BASE_URL, DEFAULT_PAGE_LIMIT } from './constants';

export class OpenLibraryClient {
  private baseUrl: string;

  constructor(baseUrl: string = SEARCH_API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Search for books using the Open Library API
   */
  async search(params: SearchParams): Promise<OpenLibrarySearchResponse> {
    const url = this.buildSearchUrl(params);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Open Library API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Build the search URL with query parameters
   */
  private buildSearchUrl(params: SearchParams): URL {
    const url = new URL(this.baseUrl);

    if (params.q) {
      url.searchParams.set('q', params.q);
    }

    if (params.sort) {
      url.searchParams.set('sort', params.sort);
    }

    url.searchParams.set('page', String(params.page ?? 1));
    url.searchParams.set('limit', String(params.limit ?? DEFAULT_PAGE_LIMIT));

    // Request only the fields we need to reduce payload size
    url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i');

    return url;
  }

  /**
   * Build a query string with place filter appended
   */
  static buildQueryWithPlace(baseQuery: string, place: string): string {
    if (!place) return baseQuery;
    const trimmedQuery = baseQuery.trim();
    if (!trimmedQuery) return `place:${place}`;
    return `${trimmedQuery} place:${place}`;
  }

  /**
   * Get cover image URL for a book
   */
  static getCoverUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string | null {
    if (!coverId) return null;
    return `${COVER_BASE_URL}/${coverId}-${size}.jpg`;
  }

  /**
   * Transform API response to display format
   */
  static transformToDisplay(book: OpenLibraryBook): BookDisplay {
    return {
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] ?? 'Unknown Author',
      publishYear: book.first_publish_year ?? null,
      coverUrl: OpenLibraryClient.getCoverUrl(book.cover_i),
    };
  }
}
