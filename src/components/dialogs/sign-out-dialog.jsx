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
import { LogOut, X } from 'lucide-react';

export function SignOutDialog({ open, onOpenChange, onConfirmSignOut }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-96'>
        <DialogHeader>
          <DialogTitle>Are you sure you want to sign out?</DialogTitle>
          <DialogDescription>You will be returned to the login page.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button
            type='button'
            variant='destructive'
            onClick={() => {
              if (onConfirmSignOut) {
                onConfirmSignOut();
              }
              if (onOpenChange) {
                onOpenChange(false);
              }
            }}
          >
            <LogOut /> Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
