import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-1/4' />
        <Skeleton className='mt-1 h-4 w-1/2' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-48 w-full' />
      </CardContent>
    </Card>
  );
}
