import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { SemesterDatePicker } from '@/components/semester-date-picker';
import { SemesterGroupsList } from '@/components/semester-groups-list';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { updateSemester } from '@/lib/semesters-handlers';
import { useGroups } from '@/contexts/groups-context';
import { Textarea } from '@/components/ui/textarea';

export function EditSemesterDialog({ open, onOpenChange, semesterDoc }) {
  const [semester, setSemester] = useState('');
  const [focus, setFocus] = useState('');
  const [groupId, setGroupId] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const { groups, loading: groupsLoading } = useGroups();

  useEffect(() => {
    if (semesterDoc) {
      setSemester(semesterDoc.semester || '');
      setFocus(semesterDoc.focus || '');
      setGroupId(semesterDoc.group || '');
      setStart(semesterDoc.start?.toDate?.() || new Date());
      setEnd(semesterDoc.end?.toDate?.() || new Date());
    }
  }, [semesterDoc]);

  const handleUpdate = async () => {
    const updatedData = {
      semester,
      focus,
      group: groupId,
      start,
      end,
    };

    await toast.promise(updateSemester(semesterDoc.id, updatedData), {
      loading: 'Updating semester...',
      success: () => {
        handleDialogOpenChange(false);
        return 'Semester updated successfully';
      },
      error: (err) => {
        console.err('Error updating semester:', err);
        return 'Failed to update semester. Please try again.';
      },
    });
  };

  const handleDialogOpenChange = (isOpen) => {
    if (!isOpen) {
      if (semesterDoc) {
        setSemester(semesterDoc.semester || '');
        setFocus(semesterDoc.focus || '');
        setGroupId(semesterDoc.group || '');
        setStart(semesterDoc.start?.toDate?.() || new Date());
        setEnd(semesterDoc.end?.toDate?.() || new Date());
      }
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  if (!semesterDoc) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit Semester</DialogTitle>
          <DialogDescription>Update semester information as needed.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label>Semester Name</Label>
            <Input
              type='text'
              placeholder='20XX Season'
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </div>
          <div className='grid gap-3'>
            <Label>
              Semester Focus <span className='text-primary'>(optional)</span>
            </Label>
            <Textarea
              placeholder='Enter the goal focus for this semester'
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>
          <div className='grid gap-3'>
            <Label>Semester Start Date</Label>
            <SemesterDatePicker date={start} onDateChange={setStart} />
          </div>
          <div className='grid gap-3'>
            <Label>Semester End Date</Label>
            <SemesterDatePicker date={end} onDateChange={setEnd} />
          </div>
          <div className='grid gap-3'>
            <Label>Semester Group</Label>
            {groupsLoading ? (
              <p className='text-muted-foreground text-sm'>Loading groups...</p>
            ) : (
              <SemesterGroupsList options={groups} value={groupId} setValue={setGroupId} />
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleUpdate}>
            <Save /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
