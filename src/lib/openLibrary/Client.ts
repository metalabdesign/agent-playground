export interface SearchParams {
  q?: string;
  sort?: 'new' | 'old' | 'rating' | 'title' | 'random' | '';
  page?: number;
  limit?: number;
}

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  ratings_average?: number;
  edition_count?: number;
}

export interface SearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Book[];
}

export class OpenLibraryClient {
  private baseUrl = 'https://openlibrary.org';

  async search(params: SearchParams): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set('q', params.q);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    
    // Explicit fields to reduce payload size
    searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,ratings_average,edition_count');

    const response = await fetch(`${this.baseUrl}/search.json?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Open Library API error: ${response.statusText}`);
    }

    return response.json();
  }
}
