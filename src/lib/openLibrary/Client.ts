import type { SearchParams, SearchResponse } from './types';

export class OpenLibraryClient {
  private baseUrl = 'https://openlibrary.org';

  async search(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}/search.json?${queryParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open Library API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as SearchResponse;
  }
}
