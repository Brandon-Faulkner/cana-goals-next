'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, X, RefreshCw } from 'lucide-react';

export function PWALifecycle() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      const handleUpdate = () => {
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });
        wb.messageSkipWaiting();
        toast.dismiss('pwa-update-toast');
      };

      const promptNewVersionAvailable = () => {
        toast(
          <div className='max-xxs:flex-col xxs:items-center flex w-full items-end gap-3'>
            <Download className='text-primary max-xxs:self-start h-5 w-5 flex-shrink-0' />
            <div className='flex-1'>
              <div className='text-sm font-medium'>Update Available</div>
              <div className='text-muted-foreground mt-1 text-xs'>
                A new version of Cana Goals is ready to install.
              </div>
            </div>
            <div className='flex flex-shrink-0 gap-2'>
              <Button size='sm' onClick={handleUpdate} className='h-8 px-3'>
                <RefreshCw />
                Update
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => toast.dismiss('pwa-update-toast')}
                className='h-8 w-8 p-0'
              >
                <X />
              </Button>
            </div>
          </div>,
          {
            duration: Infinity,
            classNames: { content: 'w-full' },
            id: 'pwa-update-toast',
          },
        );
      };

      wb.addEventListener('waiting', promptNewVersionAvailable);
      wb.addEventListener('externalwaiting', promptNewVersionAvailable);

      return () => {
        wb.removeEventListener('waiting', promptNewVersionAvailable);
        wb.removeEventListener('externalwaiting', promptNewVersionAvailable);
      };
    }
  }, []);

  return null;
}
