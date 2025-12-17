"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BookCard } from "@/src/components/books/BookCard";
import { Pagination } from "@/src/components/Pagination";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select } from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useOpenLibraryClient } from "@/src/lib/openLibrary/OpenLibraryProvider";

const SORT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "Relevance", value: "" },
  { label: "New", value: "new" },
  { label: "Old", value: "old" },
  { label: "Rating", value: "rating" },
  { label: "Title", value: "title" },
  { label: "Random", value: "random" },
];

const PLACE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "Anywhere", value: "" },
  { label: "London", value: "London" },
  { label: "New York", value: "New York" },
  { label: "Paris", value: "Paris" },
  { label: "Berlin", value: "Berlin" },
  { label: "Tokyo", value: "Tokyo" },
  { label: "Rome", value: "Rome" },
];

const PAGE_SIZE = 10;
const MAX_PAGE_COUNT = 1000;

function buildQuery(rawTerm: string, place: string) {
  const term = rawTerm.trim();
  if (!place) return term;
  const placeQuery = place.includes(" ") ? `place:"${place}"` : `place:${place}`;
  return [term, placeQuery].filter(Boolean).join(" ").trim();
}

function clampPage(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
}

function getStringField(doc: Record<string, unknown>, key: string): string | undefined {
  const value = doc[key];
  return typeof value === "string" ? value : undefined;
}

function getNumberField(doc: Record<string, unknown>, key: string): number | undefined {
  const value = doc[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function getStringArrayField(doc: Record<string, unknown>, key: string): string[] | undefined {
  const value = doc[key];
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((entry): entry is string => typeof entry === "string");
  return strings.length ? strings : undefined;
}

function coverUrlFromId(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

export function BooksHomepage() {
  const client = useOpenLibraryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQ = searchParams.get("q") ?? "";
  const urlSort = searchParams.get("sort") ?? "";
  const urlPlace = searchParams.get("place") ?? "";
  const urlPage = clampPage(Number(searchParams.get("page") ?? "1"));

  const [draftQ, setDraftQ] = React.useState(urlQ);
  const [requestNonce, setRequestNonce] = React.useState(0);

  React.useEffect(() => {
    setDraftQ(urlQ);
  }, [urlQ]);

  const apiQ = React.useMemo(() => buildQuery(urlQ, urlPlace), [urlQ, urlPlace]);

  const [data, setData] = React.useState<{
    numFound: number;
    docs: Array<Record<string, unknown>>;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const pageCount = React.useMemo(() => {
    const total = data?.numFound ?? 0;
    const count = Math.max(1, Math.ceil(total / PAGE_SIZE));
    return Math.min(count, MAX_PAGE_COUNT);
  }, [data?.numFound]);

  const updateUrl = React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) next.delete(key);
        else next.set(key, value);
      }
      const query = next.toString();
      router.push(query ? `/?${query}` : "/");
    },
    [router, searchParams],
  );

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!apiQ) {
        setIsLoading(false);
        setError(null);
        setData(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await client.search({
          q: apiQ || undefined,
          sort: urlSort || undefined,
          page: urlPage,
          limit: PAGE_SIZE,
          fields: "key,title,author_name,first_publish_year,cover_i",
        });
        if (cancelled) return;
        setData({ numFound: result.numFound, docs: result.docs });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
        setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [apiQ, client, requestNonce, urlPage, urlSort]);

  const books = React.useMemo(() => {
    return (data?.docs ?? []).map((doc, index) => {
      const key = getStringField(doc, "key") ?? `row-${index}`;
      const title = getStringField(doc, "title") ?? "Untitled";
      const author = (getStringArrayField(doc, "author_name") ?? []).join(", ");
      const firstPublishYear = getNumberField(doc, "first_publish_year");
      const coverId = getNumberField(doc, "cover_i");
      const coverUrl = coverId ? coverUrlFromId(coverId) : undefined;
      return { key, title, author, firstPublishYear, coverUrl };
    });
  }, [data?.docs]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Open Library Search</h1>
          <p className="text-sm text-muted-foreground">
            Search, sort, filter by place, and paginate through results.
          </p>
        </div>

        <form
          className="grid gap-3 sm:grid-cols-12 sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const nextQ = draftQ.trim();
            updateUrl({ q: nextQ ? nextQ : undefined, page: undefined });
          }}
        >
          <div className="sm:col-span-6">
            <label className="mb-1 block text-sm font-medium" htmlFor="q">
              Search
            </label>
            <Input
              id="q"
              value={draftQ}
              placeholder="Try: dune"
              onChange={(e) => setDraftQ(e.target.value)}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="mb-1 block text-sm font-medium" htmlFor="sort">
              Sort
            </label>
            <Select
              id="sort"
              value={urlSort}
              onChange={(e) =>
                updateUrl({ sort: e.target.value ? e.target.value : undefined, page: undefined })
              }
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-3">
            <label className="mb-1 block text-sm font-medium" htmlFor="place">
              Place
            </label>
            <Select
              id="place"
              value={urlPlace}
              onChange={(e) =>
                updateUrl({ place: e.target.value ? e.target.value : undefined, page: undefined })
              }
            >
              {PLACE_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-12 flex items-center gap-2">
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                updateUrl({ q: undefined, sort: undefined, place: undefined, page: undefined })
              }
            >
              Reset
            </Button>
          </div>
        </form>
      </header>

      <section className="rounded-lg border bg-card p-4 text-card-foreground">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            {apiQ ? (
              <>
                {isLoading
                  ? "Loading…"
                  : error
                    ? "Couldn’t load results."
                    : `${data?.numFound ?? 0} results`}
              </>
            ) : (
              "Enter a search term to see results."
            )}
          </div>
          {error ? (
            <Button type="button" variant="outline" onClick={() => setRequestNonce((n) => n + 1)}>
              Retry
            </Button>
          ) : null}
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {apiQ ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border bg-card">
                    <Skeleton className="aspect-[2/3] w-full" />
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                  </div>
                ))
              : books.map((book) => (
                  <BookCard
                    key={book.key}
                    title={book.title}
                    author={book.author}
                    firstPublishYear={book.firstPublishYear}
                    coverUrl={book.coverUrl}
                  />
                ))}
          </div>
        ) : null}

        {!isLoading && apiQ && !error && books.length === 0 ? (
          <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
            No results found. Try a different search.
          </div>
        ) : null}
      </section>

      {apiQ ? (
        <footer className="rounded-lg border bg-card p-4 text-card-foreground">
          <Pagination
            page={Math.min(urlPage, pageCount)}
            pageCount={pageCount}
            onPageChange={(nextPage) =>
              updateUrl({ page: nextPage === 1 ? undefined : String(nextPage) })
            }
          />
        </footer>
      ) : null}
    </div>
  );
}
