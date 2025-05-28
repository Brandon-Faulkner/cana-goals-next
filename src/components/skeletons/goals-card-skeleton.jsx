import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function GoalsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-1/4' />
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-5/6' />
            <Skeleton className='h-4 w-2/3' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
