'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function OfflineDetector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on offline page
    if (pathname === '/offline') return;

    const handleOffline = () => {
      // Store the current page to return to later
      sessionStorage.setItem('preOfflinePage', pathname);
      router.push('/offline');
    };

    const handleOnline = () => {
      // Only redirect back if we're currently on the offline page
      if (pathname === '/offline') {
        const preOfflinePage = sessionStorage.getItem('preOfflinePage');
        if (preOfflinePage && preOfflinePage !== '/offline') {
          sessionStorage.removeItem('preOfflinePage');
          router.push(preOfflinePage);
        } else {
          router.push('/');
        }
      }
    };

    // Check initial state
    if (!navigator.onLine && pathname !== '/offline') {
      handleOffline();
    }

    // Add event listeners
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [router, pathname]);

  return null;
}
