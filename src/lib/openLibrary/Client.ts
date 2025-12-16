export type OpenLibrarySearchSort =
  | ""
  | "new"
  | "old"
  | "rating"
  | "title"
  | "random";

export type OpenLibrarySearchParams = {
  q: string;
  sort?: OpenLibrarySearchSort;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
};

export type OpenLibrarySearchDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  edition_count?: number;
  cover_i?: number;
  ratings_average?: number;
};

export type OpenLibrarySearchResponse = {
  numFound: number;
  start: number;
  docs: OpenLibrarySearchDoc[];
};

export class OpenLibraryClient {
  constructor(private readonly baseUrl = "https://openlibrary.org") {}

  async search({
    q,
    sort = "",
    page = 1,
    limit = 20,
    signal,
  }: OpenLibrarySearchParams): Promise<OpenLibrarySearchResponse> {
    const params = new URLSearchParams();
    params.set("q", q);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const res = await fetch(`${this.baseUrl}/search.json?${params.toString()}`, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Open Library search failed (${res.status})`);
    }

    const json = (await res.json()) as {
      numFound?: number;
      start?: number;
      docs?: unknown;
    };

    return {
      numFound: json.numFound ?? 0,
      start: json.start ?? 0,
      docs: Array.isArray(json.docs) ? (json.docs as OpenLibrarySearchDoc[]) : [],
    };
  }
}

