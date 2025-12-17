'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useOpenLibrary } from '@/src/lib/openLibrary/Context';
import { SearchResponse } from '@/src/lib/openLibrary/Client';
import { Input } from '@/src/components/shadcnui/input';
import { Button } from '@/src/components/shadcnui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/shadcnui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/shadcnui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/src/components/shadcnui/pagination';
import { Skeleton } from '@/src/components/shadcnui/skeleton';

const PLACES = [
  'London',
  'Paris',
  'New York',
  'Tokyo',
  'Rome',
  'Berlin'
];

const SORTS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'new', label: 'Newest' },
  { value: 'old', label: 'Oldest' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title' },
  { value: 'random', label: 'Random' },
];

export default function BookSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const client = useOpenLibrary();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read state from URL
  const q = searchParams.get('q') || '';
  const place = searchParams.get('place') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;

  // Local state for the input to allow typing without constantly fetching/updating URL
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, replace]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: searchInput, page: '1' });
  };

  const handleSortChange = (value: string) => {
    updateUrl({ sort: value === 'relevance' ? '' : value, page: '1' });
  };

  const handlePlaceChange = (newPlace: string) => {
    updateUrl({ place: newPlace === 'all' ? '' : newPlace, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
  };

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch if there is a search term or a place selected (or both)
      if (!q && !place) {
        setData(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let apiQuery = q;
        if (place) {
            // If place has spaces, quote it, otherwise simple place:Value
            const placeTag = place.includes(' ') ? `"${place}"` : place;
            apiQuery = `${apiQuery} place:${placeTag}`.trim();
        }

        const result = await client.search({
          q: apiQuery,
          sort: sort as any,
          page,
          limit
        });
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client, q, place, sort, page]);

  // Pagination logic
  const totalPages = data ? Math.ceil(data.numFound / limit) : 0;
  
  // Helper to generate cover URL
  const getCoverUrl = (coverId?: number) => 
    coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : 'https://placehold.co/180x280?text=No+Cover';

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Open Library Search</h1>

      {/* Search Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end bg-card p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSearch} className="flex-1 space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="flex gap-2">
            <Input 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search books..."
            />
            <Button type="submit">Search</Button>
          </div>
        </form>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sort || 'relevance'} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48 space-y-2">
           <label className="text-sm font-medium">Filter by Place</label>
           <Select value={place} onValueChange={handlePlaceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a place..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Places</SelectItem>
              {PLACES.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="text-red-500 p-4 border border-red-200 rounded">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="space-y-3">
               <Skeleton className="h-[250px] w-full rounded-xl" />
               <Skeleton className="h-4 w-[250px]" />
               <Skeleton className="h-4 w-[200px]" />
             </div>
          ))}
        </div>
      ) : (
        data && (
          <div className="space-y-6">
            <p className="text-muted-foreground">Found {data.numFound} results</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.docs.map((book) => (
                <Card key={book.key} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
                   <div className="relative aspect-[2/3] w-full bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={getCoverUrl(book.cover_i)} 
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                   </div>
                   <CardHeader className="p-4 pb-2">
                     <CardTitle className="text-lg leading-tight line-clamp-2" title={book.title}>
                       {book.title}
                     </CardTitle>
                     <CardDescription className="line-clamp-1">
                       {book.author_name?.join(', ') || 'Unknown Author'}
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="p-4 pt-0 flex-1">
                     <div className="text-sm text-muted-foreground mt-2 space-y-1">
                       {book.first_publish_year && (
                         <div>Published: {book.first_publish_year}</div>
                       )}
                       {book.ratings_average && (
                         <div className="flex items-center gap-1">
                           <span>⭐</span>
                           <span>{book.ratings_average.toFixed(1)}</span>
                         </div>
                       )}
                     </div>
                   </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
               <Pagination>
                 <PaginationContent>
                   <PaginationItem>
                     <Button 
                        variant="ghost" 
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                     >
                       Previous
                     </Button>
                   </PaginationItem>
                   
                   <PaginationItem>
                     <span className="flex items-center px-4">
                        Page {page} of {Math.min(totalPages, 1000)}
                     </span>
                   </PaginationItem>

                   <PaginationItem>
                      <Button 
                        variant="ghost" 
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(page + 1)}
                     >
                       Next
                     </Button>
                   </PaginationItem>
                 </PaginationContent>
               </Pagination>
            )}
          </div>
        )
      )}
    </div>
  );
}