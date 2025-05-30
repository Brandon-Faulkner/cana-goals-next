'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function ResetPassForm({ className, oobCode, email }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password should be at least 6 characters long.');
      return;
    }

    await toast.promise(confirmPasswordReset(auth, oobCode, newPassword), {
      loading: 'Resetting password...',
      success: () => {
        router.push('/login');
        return 'Password has been successfully reset. Please log in with your new password.';
      },
      error: (err) => {
        if (err.code === 'auth/weak-password') {
          return 'The password is too weak. Please choose a stronger password.';
        }
        if (err.code === 'auth/invalid-action-code') {
          router.push('/login');
          return 'The password reset link is invalid or has expired. Please try again.';
        }
        return 'Failed to reset password. Please try again.';
      },
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-primary text-xl'>Reset Password</CardTitle>
          {email && <CardDescription>Enter a new password for {email}.</CardDescription>}
          {!email && <CardDescription>Enter a new password.</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='new-password'>New Password</Label>
              <Input
                id='new-password'
                type='password'
                placeholder='••••••••'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='confirm-password'>Confirm New Password</Label>
              <Input
                id='confirm-password'
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              <KeyRound />
              Set New Password
            </Button>
            <Link href={'./login'} className='m-auto text-base underline-offset-4 hover:underline'>
              Back to Login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
