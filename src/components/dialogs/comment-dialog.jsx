import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

export function CommentDialog({ forContextMenu = true, addComment }) {
  const [text, setText] = useState('');

  const dialogContent = (
    <DialogContent className='sm:max-w-xl'>
      <DialogHeader>
        <DialogTitle>Add A Comment</DialogTitle>
        <DialogDescription>
          Add a new comment for this goal or its building blocks.
        </DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <div className='grid gap-4'>
          <Label htmlFor='comment'>Comment</Label>
          <Textarea
            id='comment'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='w-full'
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='button' variant='secondary'>
            <X /> Cancel
          </Button>
        </DialogClose>
        <Button type='button' onClick={() => addComment(text)}>
          <Save /> Save Comment
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
          <Button variant='outline'>Add A Comment</Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }
}
