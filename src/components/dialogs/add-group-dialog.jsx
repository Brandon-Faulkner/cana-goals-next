import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { addGroup } from '@/lib/group-handlers';

export function AddGroupDialog({ open, onOpenChange }) {
  const [name, setName] = useState('');
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [description, setDescription] = useState('');

  const handleAddGroup = async () => {
    if (!name.trim()) {
      toast.error('Group name is required.');
      return;
    }

    await toast.promise(addGroup(name, slackEnabled, description), {
      loading: 'Creating group...',
      success: () => {
        handleDialogOpenChange(false);
        return 'Group added successfully';
      },
      error: (err) => {
        console.error('Error creating group:', err);
        return 'Failed to create group. Please try again.';
      },
    });
  };

  const handleDialogOpenChange = (isOpen) => {
    if (!isOpen) {
      clearInput();
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  const clearInput = () => {
    setName('');
    setSlackEnabled(false);
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
          <DialogDescription>
            Add a group to use across semesters and user assignments.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label>Group Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='flex items-center justify-between space-x-2 p-1'>
            <div className='grid gap-1.5'>
              <Label htmlFor='slack-enabled' className='cursor-pointer font-semibold'>
                Slack Notifications
              </Label>
              <p className='text-muted-foreground text-sm'>
                Post comments and status changes to Slack for this group (only for members with a
                Slack ID).
              </p>
            </div>
            <Switch
              id='slack-enabled'
              checked={slackEnabled}
              onCheckedChange={setSlackEnabled}
              className='cursor-pointer'
            />
          </div>
          <div className='grid gap-3'>
            <Label>
              Description <span className='text-primary'>(optional)</span>
            </Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleAddGroup}>
            <Users /> Add Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
