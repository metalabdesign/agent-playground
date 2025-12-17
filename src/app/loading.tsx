import { Card, CardContent } from '@/src/components/shadcnui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Book Search</h1>

        {/* Filters skeleton */}
        <div className="mb-6 space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
            <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Results count skeleton */}
        <div className="mb-4 h-5 w-48 bg-muted rounded animate-pulse" />

        {/* Book cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden h-full">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-[100px] h-[150px] bg-muted rounded animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
