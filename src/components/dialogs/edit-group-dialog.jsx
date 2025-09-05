import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { updateGroup } from '@/lib/group-handlers';

export function EditGroupDialog({ open, onOpenChange, group }) {
  const [name, setName] = useState('');
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (group) {
      setName(group.name || '');
      setSlackEnabled(group.slackEnabled || false);
      setDescription(group.description || '');
    }
  }, [group]);

  const handleUpdateGroup = async () => {
    if (!name.trim()) {
      toast.error('Group name is required.');
      return;
    }

    const updatedData = {
      name,
      slackEnabled,
      description,
    };

    await toast.promise(updateGroup(group.id, updatedData), {
      loading: 'Updating group...',
      success: () => {
        handleDialogOpenChange(false);
        return 'Group updated successfully';
      },
      error: (err) => {
        console.error('Error updating group:', err);
        return 'Failed to update group. Please try again.';
      },
    });
  };

  const handleDialogOpenChange = (isOpen) => {
    if (!isOpen) {
      setName(group?.name || '');
      setSlackEnabled(group?.slackEnabled || false);
      setDescription(group?.description || '');
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>Update the name or description of this group.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label>Group Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Group name'
            />
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
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Short description of the group'
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleUpdateGroup}>
            <Save /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
