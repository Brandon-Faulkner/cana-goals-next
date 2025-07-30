'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Spinner from '@/components/ui/spinner';

export default function RouteGuard({ children, mode = 'protected', adminOnly = false }) {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (mode === 'protected' && !user) {
        router.replace('/login');
      } else if (mode === 'public' && user) {
        router.replace('/main');
      } else if (adminOnly && user && !userDoc?.admin) {
        router.replace('/main');
      }
    }
  }, [user, userDoc, loading, mode, adminOnly, router]);

  if (
    loading ||
    (mode === 'protected' && !user) ||
    (mode === 'public' && user) ||
    (adminOnly && !userDoc?.admin)
  ) {
    return <Spinner />;
  }

  return children;
}
