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
import { useAuth } from '@/contexts/auth-provider';
import { useSemesters } from '@/hooks/use-semesters';
import { useGroups } from '@/hooks/use-groups';

export function SwitchGroupDialog({ open, onOpenChange }) {
  const { userDoc } = useAuth();
  const { currentGroupId, setCurrentGroupId } = useSemesters();
  const [selectedGroup, setSelectedGroup] = useState('');
  const { groups, loading } = useGroups();

  useEffect(() => {
    if (open && currentGroupId) {
      setSelectedGroup(currentGroupId);
    }
  }, [open, currentGroupId]);

  const userGroups = useMemo(() => {
    if (!userDoc?.group || !groups.length) return [];
    return groups.filter((group) => userDoc.group.includes(group.id));
  }, [userDoc, groups]);

  const handleSave = async () => {
    if (!selectedGroup) {
      toast.error('Please select a group.');
      return;
    }

    setCurrentGroupId(selectedGroup);

    if (onOpenChange) {
      onOpenChange(false);
    }

    toast.success('Group switched successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Switch Group</DialogTitle>
          <DialogDescription>Select a group to view its semesters and goals.</DialogDescription>
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
