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
import { Save, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-provider';
import { db } from '@/lib/firebase';

export function SettingsDialog({ open, onOpenChange }) {
  const { user, userDoc } = useAuth();
  const [completionConfetti, setCompletionConfetti] = useState(true);
  const [commentEmails, setCommentEmails] = useState(true);

  useEffect(() => {
    if (open && user && userDoc) {
      const settings = userDoc.settings;
      if (settings) {
        if (typeof settings.confetti === 'boolean') {
          setCompletionConfetti(settings.confetti);
        }
        if (typeof settings.emails === 'boolean') {
          setCommentEmails(settings.emails);
        }
      }
    }
  }, [open, user, userDoc]);

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings.');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const settingsToSave = {
      settings: {
        confetti: completionConfetti,
        emails: commentEmails,
      },
    };

    await toast.promise(updateDoc(userDocRef, settingsToSave), {
      loading: 'Saving settings...',
      success: () => {
        if (onOpenChange) {
          onOpenChange(false);
        }
        return 'Settings saved successfully';
      },
      error: (err) => {
        console.error('Error saving settings:', err);
        return 'Failed to save settings. Please try again.';
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Update your preferences and account settings.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='grid gap-6 py-4'>
          <div className='flex items-center justify-between space-x-2 p-1'>
            <div className='grid gap-1.5'>
              <Label htmlFor='completion-confetti' className='cursor-pointer font-semibold'>
                Completion confetti
              </Label>
              <p className='text-muted-foreground text-sm'>
                Celebrate your achievements with a burst of confetti when you complete a goal.
              </p>
            </div>
            <Switch
              id='completion-confetti'
              checked={completionConfetti}
              onCheckedChange={setCompletionConfetti}
              className='cursor-pointer'
            />
          </div>

          <div className='flex items-center justify-between space-x-2 p-1'>
            <div className='grid gap-1.5'>
              <Label htmlFor='comment-emails' className='cursor-pointer font-semibold'>
                Comment emails
              </Label>
              <p className='text-muted-foreground text-sm'>
                Receive email notifications for new comments on your goals.
              </p>
            </div>
            <Switch
              id='comment-emails'
              checked={commentEmails}
              onCheckedChange={setCommentEmails}
              className='cursor-pointer'
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <X/> Close
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleSave}>
            <Save /> Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
