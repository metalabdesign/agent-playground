export type OpenLibrarySearchParamValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>;

export type OpenLibrarySearchParams = {
  q?: string;
  title?: string;
  author?: string;
  subject?: string;
  place?: string;
  person?: string;
  publisher?: string;
  language?: string;
  isbn?: string;
  lccn?: string;
  oclc?: string;
  contributor?: string;
  publish_year?: string | number;
  first_publish_year?: string | number;
  time?: string;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  ebook_access?: "no_ebook" | "public" | "borrowable" | "printdisabled";
  fields?: string | string[];
  sort?: string;
  page?: number;
  limit?: number;
  offset?: number;
  edition_count?: number;
  key?: string;
  [key: string]: OpenLibrarySearchParamValue | undefined;
};

export type OpenLibrarySearchDoc = Record<string, unknown>;

export type OpenLibrarySearchResponse = {
  numFound: number;
  start: number;
  numFoundExact?: boolean;
  docs: OpenLibrarySearchDoc[];
  q?: string;
  offset?: number | null;
};

export type OpenLibraryClientConfig = {
  baseUrl?: string;
  fetch?: typeof fetch;
};

export class OpenLibraryClient {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;

  constructor(config: OpenLibraryClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? "https://openlibrary.org";
    const fetcher = config.fetch ?? fetch;
    this.fetcher = fetcher.bind(globalThis) as typeof fetch;
  }

  async search(params: OpenLibrarySearchParams): Promise<OpenLibrarySearchResponse> {
    const url = new URL("/search.json", this.baseUrl);
    url.search = toSearchParams(params).toString();

    const response = await this.fetcher(url, {
      method: "GET",
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `OpenLibrary search failed: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as OpenLibrarySearchResponse;
  }
}

function toSearchParams(params: OpenLibrarySearchParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(params)) {
    if (rawValue === undefined || rawValue === null) continue;
    if (Array.isArray(rawValue)) {
      for (const entry of rawValue) {
        searchParams.append(key, String(entry));
      }
      continue;
    }
    searchParams.set(key, typeof rawValue === "boolean" ? String(rawValue) : String(rawValue));
  }

  return searchParams;
}
