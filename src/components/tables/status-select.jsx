import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CircleX, BriefcaseBusiness, CheckCheck, Hourglass, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-provider';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const statuses = [
  {
    value: 'Not Working On',
    icon: CircleX,
    color: 'border-chart-1 text-chart-1',
  },
  {
    value: 'Working On',
    icon: BriefcaseBusiness,
    color: 'border-chart-2 text-chart-2',
  },
  {
    value: 'Completed',
    icon: CheckCheck,
    color: 'border-chart-3 text-chart-3',
  },
  { value: 'Waiting', icon: Hourglass, color: 'border-chart-4 text-chart-4' },
  { value: 'Stuck', icon: TriangleAlert, color: 'border-chart-5 text-chart-5' },
];

export function StatusSelect({ value, onValueChange, disabled = false }) {
  const { userDoc } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const selected = statuses.find((s) => s.value === value);
  const StatusIcon = selected?.icon;
  const bgColor = selected?.color ?? 'bg-white';

  const handleValueChange = (newStatus) => {
    // Check if user is changing to "Completed" and has confetti enabled
    if (
      newStatus === 'Completed' &&
      value !== 'Completed' &&
      userDoc?.settings?.confetti !== false
    ) {
      setShowConfetti(true);
    }

    onValueChange(newStatus);
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      {showConfetti &&
        createPortal(
          <Fireworks
            autorun={{ speed: 3, duration: 5000, delay: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />,
          document.body,
        )}
      <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger className={cn('w-full min-w-44 border-2', bgColor)} aria-label='Status selection'>
          <SelectValue>
            <div className='flex items-center gap-2'>
              {StatusIcon && <StatusIcon className={cn('h-4 w-4', bgColor)} />}
              <span>{value}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => {
            const Icon = status.icon;
            return (
              <SelectItem
                key={status.value}
                value={status.value}
                className='flex items-center gap-2'
              >
                <div className='flex items-center gap-2'>
                  <Icon className={cn('h-4 w-4', status.color.split(' ')[1])} />
                  <span>{status.value}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
