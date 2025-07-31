import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SemesterGroupsList({ options, value, setValue, currentGroupId = null }) {
  return (
    <ScrollArea className='max-h-60 w-full rounded-md border p-2'>
      <RadioGroup value={value} onValueChange={setValue} className='grid gap-6 py-2'>
        {options.map(({ id, name, description }) => {
          const isActive = id === currentGroupId;

          return (
            <div key={id} className='flex items-center justify-between space-x-2 p-1'>
              <div className='grid gap-1.5'>
                <Label htmlFor={id} className='cursor-pointer font-semibold'>
                  {name}
                  {isActive && (
                    <span className='text-primary text-sm font-normal'>(currently active)</span>
                  )}
                </Label>
                <p className='text-muted-foreground text-sm'>{description}</p>
              </div>
              <RadioGroupItem id={id} value={id} className='cursor-pointer' />
            </div>
          );
        })}
      </RadioGroup>
    </ScrollArea>
  );
}
