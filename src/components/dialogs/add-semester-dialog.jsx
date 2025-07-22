import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CalendarIcon, CalendarPlus, X } from 'lucide-react';
import { SemesterGroupsList } from '@/components/semester-groups-list';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useGroups } from '@/hooks/use-groups';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function AddSemesterDialog({ open, onOpenChange, isAdmin }) {
  const [semesterName, setSemesterName] = useState('');
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

    const semestersRef = collection(db, 'semesters');
    const semesterData = {
      end: Timestamp.fromDate(new Date(endDate)),
      focus: '',
      semester: semesterName,
      start: Timestamp.fromDate(new Date(startDate)),
      group: selectedGroupId,
    };

    await toast.promise(addDoc(semestersRef, semesterData), {
      loading: 'Adding semester...',
      success: () => {
        if (onOpenChange) {
          onOpenChange(false);
          clearInput();
        }
        return 'Semester added successfully';
      },
      error: (err) => {
        console.error('Error adding semester:', err);
        return 'Failed to add semester. Please try again.';
      },
    });
  };

  const clearInput = () => {
    setSemesterName('');
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Label>Semester Start Date</Label>
            <DatePicker date={startDate} onDateChange={setStartDate} />
          </div>
          <div className='grid gap-3'>
            <Label>Semester End Date</Label>
            <DatePicker date={endDate} onDateChange={setEndDate} />
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
            <Button type='button' variant='secondary' onClick={clearInput}>
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

function DatePicker({ date, onDateChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full min-w-48 justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          defaultMonth={new Date()}
          selected={date}
          onSelect={onDateChange}
          autoFocus
          startMonth={new Date()}
          hidden={[{ before: new Date() }]}
        />
      </PopoverContent>
    </Popover>
  );
}
