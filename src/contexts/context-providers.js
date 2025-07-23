'use client';
import { GroupsProvider } from '@/contexts/groups-context';
import { SemestersProvider } from '@/contexts/semesters-context';
import { AuthProvider } from '@/contexts/auth-context';
import { SavingStateProvider } from '@/contexts/saving-state-context';

export function ContextProviders({ children }) {
  return (
    <AuthProvider>
      <GroupsProvider>
        <SemestersProvider>
          <SavingStateProvider>{children}</SavingStateProvider>
        </SemestersProvider>
      </GroupsProvider>
    </AuthProvider>
  );
}
