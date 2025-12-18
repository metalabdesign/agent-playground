import { OpenLibrarySearchOptions, OpenLibrarySearchResponse } from './types';

export class OpenLibraryClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://openlibrary.org') {
    this.baseUrl = baseUrl;
  }

  async search(options: OpenLibrarySearchOptions): Promise<OpenLibrarySearchResponse> {
    const url = new URL(`${this.baseUrl}/search.json`);
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Open Library API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch from Open Library:', error);
      throw error;
    }
  }
}
