'use client';
import { useState, useEffect } from 'react';
import RouteGuard from '@/components/auth/route-guard';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChevronsRight, CircleCheck, Loader2, XCircle } from 'lucide-react';
import { ManageUsers } from '@/components/admin/manage-users';
import { ManageSemesters } from '@/components/admin/manage-semesters';
import { ManageGroups } from '@/components/admin/manage-groups';
import { AppAdminSidebar } from '@/components/app-admin-sidebar';
import { useSavingState } from '@/contexts/saving-state-context';
import { useAuth } from '@/contexts/auth-context';
import { AdminCardSkeleton } from '@/components/skeletons/admin-card-skeleton';

const adminSections = {
  users: {
    title: 'Manage Users',
    component: ManageUsers,
  },
  semesters: {
    title: 'Manage Semesters',
    component: ManageSemesters,
  },
  groups: {
    title: 'Manage Groups',
    component: ManageGroups,
  },
};

export default function Page() {
  const { user, userDoc, loading: loadingAuth } = useAuth();
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminActiveSection') || 'users';
    }
    return 'users';
  });
  const {
    savingState: { isSaving, hasError },
  } = useSavingState();
  const isAdmin = userDoc?.admin;

  useEffect(() => {
    document.title = 'Cana Goals | Admin';
  }, []);

  useEffect(() => {
    if (activeSection) {
      localStorage.setItem('adminActiveSection', activeSection);
    }
  }, [activeSection]);

  const ActiveComponent = adminSections[activeSection]?.component;

  return (
    <RouteGuard adminOnly={true}>
      <SidebarProvider>
        <AppAdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        ></AppAdminSidebar>
        <SidebarInset>
          <header className='bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <div className='mx-auto flex w-full items-center justify-between'>
              <div className='flex flex-row items-center'>
                <h1 className='text-base font-medium'>Admin</h1>
                <ChevronsRight className='mx-2 block size-4' />
                <h1 className='text-base font-medium'>{adminSections[activeSection]?.title}</h1>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  {isSaving ? (
                    <>
                      <Loader2 className='text-primary animate-spin' />
                      <span className='max-xs:hidden'>Saving...</span>
                    </>
                  ) : hasError ? (
                    <>
                      <XCircle className='text-destructive' />
                      <span className='max-xs:hidden'>Error Saving</span>
                    </>
                  ) : (
                    <>
                      <CircleCheck className='text-primary' />
                      <span className='max-xs:hidden'>Up to Date</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className='flex flex-1 flex-col gap-4 p-4'>
            {loadingAuth ? (
              <>
                <AdminCardSkeleton />
                <AdminCardSkeleton />
              </>
            ) : ActiveComponent ? (
              <ActiveComponent isAdmin={isAdmin} />
            ) : (
              <p>Section not found</p>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}
