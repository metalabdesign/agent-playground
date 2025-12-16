"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ExternalLink, Search, X } from "lucide-react";

import type {
  OpenLibrarySearchResponse,
  OpenLibrarySearchSort,
} from "@/src/lib/openLibrary/Client";
import { useOpenLibrary } from "@/src/lib/openLibrary/OpenLibraryProvider";
import { Badge } from "@/src/components/shadcnui/badge";
import { Button } from "@/src/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/shadcnui/card";
import { Input } from "@/src/components/shadcnui/input";
import { Label } from "@/src/components/shadcnui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/shadcnui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcnui/select";
import { Skeleton } from "@/src/components/shadcnui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/shadcnui/table";

const PAGE_SIZE = 20;

const SORT_RELEVANCE = "__relevance__";
const PLACE_ANY = "__any__";

const SORT_OPTIONS: { value: Exclude<OpenLibrarySearchSort, "">; label: string }[] =
  [
    { value: "new", label: "New" },
    { value: "old", label: "Old" },
    { value: "rating", label: "Rating" },
    { value: "title", label: "Title" },
    { value: "random", label: "Random" },
  ];

const PLACE_OPTIONS = [
  "London",
  "Paris",
  "New York",
  "San Francisco",
  "Tokyo",
  "Berlin",
  "Sydney",
  "Cairo",
] as const;

function quoteIfNeeded(value: string) {
  return /\s/.test(value) ? `"${value}"` : value;
}

function buildOpenLibraryQuery(term: string, place: string) {
  const trimmed = term.trim();
  const placeClause = place ? `place:${quoteIfNeeded(place)}` : "";
  if (!trimmed) return placeClause;
  if (!placeClause) return trimmed;
  return `${trimmed} ${placeClause}`;
}

function clampPage(n: number) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function safeSort(value: string | null): OpenLibrarySearchSort {
  const allowed = new Set<OpenLibrarySearchSort>([
    "",
    "new",
    "old",
    "rating",
    "title",
    "random",
  ]);
  const v = (value ?? "") as OpenLibrarySearchSort;
  return allowed.has(v) ? v : "";
}

function safePlace(value: string | null) {
  if (!value) return "";
  return PLACE_OPTIONS.includes(value as (typeof PLACE_OPTIONS)[number])
    ? value
    : "";
}

function toSearchString(next: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) {
    if (v) params.set(k, v);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function OpenLibrarySearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { client } = useOpenLibrary();

  const committedTerm = searchParams.get("q") ?? "";
  const committedSort = safeSort(searchParams.get("sort"));
  const committedPlace = safePlace(searchParams.get("place"));
  const committedPage = clampPage(Number(searchParams.get("page") ?? "1"));

  const [draftTerm, setDraftTerm] = useState(committedTerm);

  useEffect(() => {
    setDraftTerm(committedTerm);
  }, [committedTerm]);

  const queryForApi = useMemo(
    () => buildOpenLibraryQuery(committedTerm, committedPlace),
    [committedPlace, committedTerm]
  );

  const [data, setData] = useState<OpenLibrarySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!queryForApi) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    client
      .search({
        q: queryForApi,
        sort: committedSort,
        page: committedPage,
        limit: PAGE_SIZE,
        signal: controller.signal,
      })
      .then((res) => setData(res))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Something went wrong.");
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [client, committedPage, committedSort, queryForApi]);

  const totalPages = useMemo(() => {
    const found = data?.numFound ?? 0;
    if (!found) return 1;
    return Math.max(1, Math.ceil(found / PAGE_SIZE));
  }, [data?.numFound]);

  const paginationPages = useMemo(() => {
    const current = committedPage;
    const last = totalPages;
    const window = 2;
    const start = Math.max(1, current - window);
    const end = Math.min(last, current + window);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return { pages, start, end, last, current };
  }, [committedPage, totalPages]);

  function updateQuery(next: {
    q?: string;
    sort?: OpenLibrarySearchSort;
    place?: string;
    page?: number;
  }) {
    const q = next.q ?? committedTerm;
    const sort = next.sort ?? committedSort;
    const place = next.place ?? committedPlace;
    const page = next.page ?? committedPage;
    router.replace(
      `/${toSearchString({
        q: q.trim(),
        sort,
        place,
        page: page > 1 ? String(page) : "",
      })}`,
      { scroll: false }
    );
  }

  const showingText = useMemo(() => {
    if (!data) return null;
    if (!data.docs.length) return "No results.";
    const start = data.start + 1;
    const end = data.start + data.docs.length;
    return `Showing ${start}-${end} of ${data.numFound.toLocaleString()}`;
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Open Library Search
            </h1>
            <p className="text-sm text-muted-foreground">
              Search books via the Open Library Search API.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {committedPlace ? (
              <Badge variant="secondary">place:{committedPlace}</Badge>
            ) : null}
            {committedSort ? (
              <Badge variant="secondary">sort:{committedSort}</Badge>
            ) : null}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>
              Use a general term, optionally filter by place, and choose a sort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-12"
              onSubmit={(e) => {
                e.preventDefault();
                updateQuery({ q: draftTerm, page: 1 });
              }}
            >
              <div className="space-y-2 md:col-span-6">
                <Label htmlFor="q">Search term</Label>
                <div className="flex gap-2">
                  <Input
                    id="q"
                    placeholder='e.g. "space opera"'
                    value={draftTerm}
                    onChange={(e) => setDraftTerm(e.target.value)}
                  />
                  <Button type="submit">
                    <Search />
                    Search
                  </Button>
                </div>
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label>Sort</Label>
                <Select
                  value={committedSort || SORT_RELEVANCE}
                  onValueChange={(v) =>
                    updateQuery({
                      sort: v === SORT_RELEVANCE ? "" : safeSort(v),
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SORT_RELEVANCE}>Relevance</SelectItem>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label>Place</Label>
                <Select
                  value={committedPlace || PLACE_ANY}
                  onValueChange={(v) =>
                    updateQuery({
                      place: v === PLACE_ANY ? "" : safePlace(v),
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PLACE_ANY}>Any</SelectItem>
                    {PLACE_OPTIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-12 flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">
                  API query:{" "}
                  <span className="font-mono">
                    {queryForApi ? queryForApi : "(empty)"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDraftTerm("");
                    router.replace("/", { scroll: false });
                  }}
                >
                  <X />
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {isLoading ? "Loading…" : showingText ?? "Run a search to begin."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : data ? (
              data.docs.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[72px]">Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>First year</TableHead>
                      <TableHead>Editions</TableHead>
                      <TableHead className="text-right">Link</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.docs.map((d) => {
                      const title = d.title ?? "(Untitled)";
                      const author = d.author_name?.[0] ?? "—";
                      const year = d.first_publish_year ?? null;
                      const editions = d.edition_count ?? null;
                      const href = d.key
                        ? `https://openlibrary.org${d.key}`
                        : null;
                      const coverUrl = d.cover_i
                        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-S.jpg`
                        : null;
                      return (
                        <TableRow key={`${d.key}-${title}`}>
                          <TableCell>
                            {coverUrl ? (
                              <Image
                                src={coverUrl}
                                alt={`Cover of ${title}`}
                                width={40}
                                height={60}
                                sizes="40px"
                                className="h-[60px] w-[40px] rounded-sm border object-cover bg-muted"
                              />
                            ) : (
                              <div className="h-[60px] w-[40px] rounded-sm border bg-muted" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{title}</TableCell>
                          <TableCell>{author}</TableCell>
                          <TableCell>{year ?? "—"}</TableCell>
                          <TableCell>{editions ?? "—"}</TableCell>
                          <TableCell className="text-right">
                            {href ? (
                              <a
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open <ExternalLink className="h-4 w-4" />
                              </a>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm text-muted-foreground">No results.</div>
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                Enter a search term to see results.
              </div>
            )}
          </CardContent>
        </Card>

        {data && data.docs.length ? (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={committedPage <= 1}
                  onClick={() =>
                    updateQuery({ page: Math.max(1, committedPage - 1) })
                  }
                />
              </PaginationItem>

              {paginationPages.start > 1 ? (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => updateQuery({ page: 1 })}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {paginationPages.start > 2 ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}
                </>
              ) : null}

              {paginationPages.pages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === committedPage}
                    onClick={() => updateQuery({ page: p })}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {paginationPages.end < paginationPages.last ? (
                <>
                  {paginationPages.end < paginationPages.last - 1 ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() =>
                        updateQuery({ page: paginationPages.last })
                      }
                    >
                      {paginationPages.last}
                    </PaginationLink>
                  </PaginationItem>
                </>
              ) : null}

              <PaginationItem>
                <PaginationNext
                  disabled={committedPage >= totalPages}
                  onClick={() =>
                    updateQuery({
                      page: Math.min(totalPages, committedPage + 1),
                    })
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
