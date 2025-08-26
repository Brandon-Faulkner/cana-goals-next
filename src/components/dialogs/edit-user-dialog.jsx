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
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { updateUserDoc } from '@/lib/user-handlers';
import { useGroups } from '@/contexts/groups-context';
import { Checkbox } from '@/components/ui/checkbox';

export function EditUserDialog({ open, onOpenChange, user }) {
  const [name, setName] = useState('');
  const [slackId, setSlackId] = useState('');
  const [admin, setAdmin] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { groups, loading: loadingGroups } = useGroups();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSlackId(user.slackId || '');
      setAdmin(!!user.admin);
      setSelectedGroups(user.assignedGroups || []);
    }
  }, [user]);

  const handleToggleGroup = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  const handleUpdateUser = async () => {
    const updatedData = {
      name,
      slackId,
      admin,
      assignedGroups: selectedGroups,
    };

    await toast.promise(updateUserDoc(user.id, updatedData), {
      loading: 'Updating user...',
      success: () => {
        handleDialogOpenChange(false);
        return 'User updated successfully';
      },
      error: (err) => {
        console.error('Error updating user:', err);
        return 'Failed to update user. Please try again.';
      },
    });
  };

  const handleDialogOpenChange = (isOpen) => {
    if (!isOpen && user) {
      setName(user.name || '');
      setSlackId(user.slackId || '');
      setAdmin(!!user.admin);
      setSelectedGroups(user.assignedGroups || []);
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Edit account information and permissions for this team member.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='John Doe' />
          </div>
          <div className='grid gap-3'>
            <Label>Slack ID</Label>
            <Input
              value={slackId}
              onChange={(e) => setSlackId(e.target.value)}
              placeholder='Found in slack'
            />
          </div>
          <div className='grid gap-3'>
            <Label>Assigned Groups</Label>
            {loadingGroups ? (
              <p className='text-muted-foreground text-sm'>Loading groups...</p>
            ) : (
              <div className='grid max-h-48 gap-2 overflow-y-auto rounded-md border p-3'>
                {groups.map((group) => (
                  <label key={group.id} className='flex cursor-pointer items-center gap-2'>
                    <Checkbox
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => handleToggleGroup(group.id)}
                    />
                    <span>{group.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='admin-toggle' className='text-sm font-medium'>
              Admin Status
            </Label>
            <div className='flex items-center gap-4 rounded-md border px-4 py-3'>
              <Switch id='admin-toggle' checked={admin} onCheckedChange={setAdmin} />
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>
                  {admin ? 'Admin Enabled' : 'Standard User'}
                </span>
                <span className='text-muted-foreground text-xs'>
                  Admins can manage users, groups, and semesters.
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleUpdateUser}>
            <Save /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
