'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ResetPassForm } from '@/components/forms/reset-pass-form';
import { useAuth } from '@/contexts/auth-provider';
import { checkActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [oobCode, setOobCode] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const actionCode = searchParams.get('oobCode');

    if (authLoading) return;

    if (user) {
      toast.error('You are already logged in.');
      router.replace('/main');
      return;
    }

    if (!actionCode) {
      toast.error('No action code provided. Please use the link from your email.');
      router.replace('/login');
      return;
    }

    setOobCode(actionCode);

    // Verify the action code
    checkActionCode(auth, actionCode)
      .then((info) => {
        setEmail(info.data.email);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error verifying action code:', err);
        let errorMessage = 'Invalid or expired password reset link. Please request a new one.';
        if (err.code === 'auth/expired-action-code') {
          errorMessage = 'The password reset link has expired. Please request a new one.';
        } else if (err.code === 'auth/invalid-action-code') {
          errorMessage = 'The password reset link is invalid. Please request a new one.';
        } else if (err.code === 'auth/user-disabled') {
          errorMessage = 'This account has been disabled.';
        } else if (err.code === 'auth/user-not-found') {
          errorMessage = 'No account found for this email address.';
        }
        toast.error(errorMessage);
        setError(errorMessage);
        router.replace('/forgot-pass');
        setLoading(false);
      });
  }, [searchParams, router, user, authLoading]);

  if (loading || authLoading) {
    return <Spinner />;
  }

  if (error) {
    // Error is already shown via toast, and user is redirected.
    // This is a fallback or for cases where redirect might not happen immediately.
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
        <p className='text-destructive text-lg'>{error}</p>
        <p className='mt-2'>You will be redirected shortly.</p>
      </div>
    );
  }

  if (!oobCode) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
        <p className='text-destructive text-lg'>Missing password reset code.</p>
      </div>
    );
  }

  return (
    <div className='bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-md flex-col gap-6'>
        <div className='flex items-center gap-2 self-center text-lg font-medium'>
          <Image
            src='/android-chrome-192x192.png'
            alt='Cana Goals main logo'
            width={24}
            height={24}
            className='m-auto'
          />
          Cana Goals
        </div>
        <ResetPassForm oobCode={oobCode} email={email} />
      </div>
    </div>
  );
}

export default function Page() {
  useEffect(() => {
    document.title = 'Cana Goals | Reset Password';
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <PageContent />
    </Suspense>
  );
}
