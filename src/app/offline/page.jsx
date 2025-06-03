'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      const preOfflinePage = sessionStorage.getItem('preOfflinePage');
      if (preOfflinePage && preOfflinePage !== '/offline') {
        sessionStorage.removeItem('preOfflinePage');
        window.location.href = preOfflinePage;
      } else {
        window.location.href = '/';
      }
    }
  };
  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
            {isOnline ? (
              <Wifi className='text-primary h-6 w-6' />
            ) : (
              <WifiOff className='text-muted-foreground h-6 w-6' />
            )}
          </div>
          <CardTitle>{isOnline ? "You're Online" : "You're Offline"}</CardTitle>
          <CardDescription>
            {isOnline
              ? 'Your connection has been restored. You can retry loading the page.'
              : "It looks like you're not connected to the internet. Some features may not be available."}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {isOnline ? null : (
            <div className='text-muted-foreground space-y-2 text-sm'>
              <p>While offline:</p>
              <ul className='ml-4 list-inside list-disc space-y-1'>
                <li>Check your internet connection</li>
                <li>Try moving to a different location</li>
                <li>Wait for your connection to be restored</li>
              </ul>
            </div>
          )}
          <div className='flex flex-col gap-2'>
            <Button onClick={handleRetry} disabled={!isOnline} className='w-full'>
              <RefreshCw />
              {isOnline ? 'Retry' : 'Waiting for connection...'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
