export interface OpenLibrarySearchParams {
  q?: string;
  title?: string;
  author?: string;
  subject?: string;
  place?: string;
  person?: string;
  language?: string;
  publisher?: string;
  page?: number;
  limit?: number;
  fields?: string;
  sort?: string;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryDoc[];
  num_found: number;
  q: string;
  offset?: number;
}

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  edition_count?: number;
  subject?: string[];
  language?: string[];
  publisher?: string[];
  [key: string]: string | number | string[] | number[] | boolean | undefined | null;
}

export class OpenLibraryClient {
  private baseUrl = 'https://openlibrary.org';

  async search(params: OpenLibrarySearchParams): Promise<OpenLibrarySearchResponse> {
    const url = new URL(`${this.baseUrl}/search.json`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Open Library API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const openLibraryClient = new OpenLibraryClient();
