import { Card, CardContent } from '@/src/components/shadcnui/card';
import { Skeleton } from '@/src/components/shadcnui/skeleton';

export function BookCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[2/3] w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </CardContent>
    </Card>
  );
}
