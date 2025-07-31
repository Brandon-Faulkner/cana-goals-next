import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeftRight, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SemesterGroupsList } from '@/components/semester-groups-list';
import { useAuth } from '@/contexts/auth-context';
import { useSemesters } from '@/contexts/semesters-context';
import { useGroups } from '@/contexts/groups-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function SwitchGroupDialog({ open, onOpenChange }) {
  const { user, userDoc } = useAuth();
  const { currentGroupId, setCurrentGroupId } = useSemesters();
  const [selectedGroup, setSelectedGroup] = useState('');
  const { groups, loading } = useGroups();

  useEffect(() => {
    if (open && currentGroupId) {
      setSelectedGroup(currentGroupId);
    }
  }, [open, currentGroupId]);

  const userGroups = useMemo(() => {
    if (!userDoc?.assignedGroups || !groups.length) return [];
    return groups.filter((group) => userDoc.assignedGroups.includes(group.id));
  }, [userDoc, groups]);

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to switch groups.');
      return;
    }

    if (!selectedGroup) {
      toast.error('Please select a group.');
      return;
    }

    setCurrentGroupId(selectedGroup);
    const userDocRef = doc(db, 'users', user.uid);
    const groupToSave = {
      activeGroup: selectedGroup,
    };

    await toast.promise(updateDoc(userDocRef, groupToSave), {
      loading: 'Switching groups...',
      success: () => {
        if (onOpenChange) {
          onOpenChange(false);
        }
        return 'Switched groups successfully';
      },
      error: (err) => {
        console.error('Error switching groups:', err);
        return 'Failed to switch groups. Please try again.';
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Switch Group</DialogTitle>
          <DialogDescription>
            Switch between groups you are part of to view its semesters and goals.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          {loading ? (
            <p className='text-muted-foreground text-sm'>Loading groups...</p>
          ) : userGroups.length > 0 ? (
            <SemesterGroupsList
              options={userGroups}
              value={selectedGroup}
              setValue={setSelectedGroup}
              currentGroupId={currentGroupId}
            />
          ) : (
            <p className='text-muted-foreground text-sm'>You are not assigned to any groups.</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleSave}>
            <ArrowLeftRight /> Switch Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
