'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useSemesters } from '@/hooks/use-semesters';

export function DatePicker({ date, onDateChange }) {
  const { currentSemester } = useSemesters();

  const semesterStartDate = currentSemester?.start?.toDate();
  const semesterEndDate = currentSemester?.end?.toDate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>Pick a due date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          defaultMonth={date}
          selected={date}
          onSelect={onDateChange}
          autoFocus
          startMonth={semesterStartDate}
          endMonth={semesterEndDate}
          hidden={[{ before: semesterStartDate }, { after: semesterEndDate }]}
        />
      </PopoverContent>
    </Popover>
  );
}
