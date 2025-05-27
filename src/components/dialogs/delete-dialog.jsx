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

export function DeleteDialog({ forContextMenu = true, triggerText = "Delete", deleteAction }) {
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
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' variant='destructive' onClick={() => deleteAction()}>
          Delete
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
