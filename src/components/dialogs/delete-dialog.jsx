import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, X } from 'lucide-react';

export function DeleteDialog({ forContextMenu = true, triggerText = 'Delete', deleteAction }) {
  const dialogContent = (
    <DialogContent className='sm:max-w-96'>
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will remove the selected item from the database.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='button' variant='secondary'>
            <X /> Cancel
          </Button>
        </DialogClose>
        <Button type='button' variant='destructive' onClick={() => deleteAction()}>
          <Trash2 /> Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (forContextMenu) {
    return dialogContent;
  } else {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>{triggerText}</Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }
}
