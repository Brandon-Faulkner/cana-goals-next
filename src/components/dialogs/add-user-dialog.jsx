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
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { createUserWithDoc } from '@/lib/user-handlers';
import { useGroups } from '@/contexts/groups-context';
import { Checkbox } from '@/components/ui/checkbox';

export function AddUserDialog({ open, onOpenChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [slackId, setSlackId] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { groups, loading: loadingGroups } = useGroups();

  const handleToggleGroup = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  const handleAddUser = async () => {
    if (!email || !password || !name) {
      toast.error('Email, password, and name are required.');
      return;
    }

    if (selectedGroups.length === 0) {
      toast.error('Please select at least one group.');
      return;
    }

    await toast.promise(createUserWithDoc(email, password, name, slackId, selectedGroups), {
      loading: 'Creating user...',
      success: () => {
        handleDialogOpenChange(false);
        return 'User created successfully';
      },
      error: (err) => {
        console.error('Error creating user:', err);
        return 'Failed to create user. Please try again.';
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
    setEmail('');
    setPassword('');
    setName('');
    setSlackId('');
    setSelectedGroups([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Create a new user with login credentials and basic information.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              placeholder='email@email.com'
            />
          </div>
          <div className='grid gap-3'>
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              placeholder='Default or custom'
            />
          </div>
          <div className='grid gap-3'>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='John Doe' />
          </div>
          <div className='grid gap-3'>
            <Label>
              Slack ID <span className='text-primary'>(optional)</span>
            </Label>
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleAddUser}>
            <UserPlus /> Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
