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
import { CalendarPlus, X } from 'lucide-react';
import { SemesterDatePicker } from '@/components/semester-date-picker';
import { SemesterGroupsList } from '@/components/semester-groups-list';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useGroups } from '@/contexts/groups-context';
import { addSemester } from '@/lib/semesters-handlers';
import { Timestamp } from 'firebase/firestore';

export function AddSemesterDialog({ open, onOpenChange, isAdmin }) {
  const [semesterName, setSemesterName] = useState('');
  const [semesterFocus, setSemesterFocus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const { groups, loading: groupsLoading } = useGroups();

  const handleAddSemester = async () => {
    if (!isAdmin) {
      toast.error('You must be an admin to add a semester.');
      return;
    }

    if (!semesterName || !startDate || !endDate) {
      toast.error('Please provide all information before submitting.');
      return;
    }

    if (!selectedGroupId) {
      toast.error('Please select a group to associate with this semester.');
      return;
    }

    const semesterData = {
      end: Timestamp.fromDate(new Date(endDate)),
      focus: semesterFocus,
      semester: semesterName,
      start: Timestamp.fromDate(new Date(startDate)),
      group: selectedGroupId,
    };

    await toast.promise(addSemester(semesterData), {
      loading: 'Adding semester...',
      success: () => {
        if (onOpenChange) {
          onOpenChange(false);
        }
        return 'Semester added successfully';
      },
      error: (err) => {
        console.error('Error adding semester:', err);
        return 'Failed to add semester. Please try again.';
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
    setSemesterName('');
    setStartDate(null);
    setEndDate(null);
    setSelectedGroupId('');
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Add Semester</DialogTitle>
          <DialogDescription>Add a new semester to track more goals.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label>Semester Name</Label>
            <Input
              type='text'
              placeholder='20XX Season'
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
            />
          </div>
          <div className='grid gap-3'>
            <Label>
              Semester Focus <span className='text-primary'>(optional)</span>
            </Label>
            <Textarea
              placeholder='Enter the goal focus for this semester'
              value={semesterFocus}
              onChange={(e) => setSemesterFocus(e.target.value)}
            />
          </div>
          <div className='grid gap-3'>
            <Label>Semester Start Date</Label>
            <SemesterDatePicker date={startDate} onDateChange={setStartDate} />
          </div>
          <div className='grid gap-3'>
            <Label>Semester End Date</Label>
            <SemesterDatePicker date={endDate} onDateChange={setEndDate} />
          </div>
          <div className='grid gap-3'>
            <Label>Semester Group</Label>
            {groupsLoading ? (
              <p className='text-muted-foreground text-sm'>Loading groups...</p>
            ) : (
              <SemesterGroupsList
                options={groups}
                value={selectedGroupId}
                setValue={setSelectedGroupId}
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleAddSemester}>
            <CalendarPlus /> Add Semester
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
