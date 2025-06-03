'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, X, RefreshCw } from 'lucide-react';

export function PWAUpdateDialog({ open, onOpenChange, onUpdate }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-96'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Download className='text-primary h-5 w-5' />
            Update Available
          </DialogTitle>
          <DialogDescription>
            A new version of Cana Goals is ready to install. Update now to get the latest features
            and improvements.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X />
              Later
            </Button>
          </DialogClose>
          <Button type='button' onClick={onUpdate}>
            <RefreshCw />
            Update Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
