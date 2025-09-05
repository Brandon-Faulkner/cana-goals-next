'use client';
import { useGroups } from '@/contexts/groups-context';
import { useSemesters } from '@/contexts/semesters-context';

export function useActiveGroup() {
  const { groups } = useGroups();
  const { currentGroupId } = useSemesters();

  const activeGroup = groups?.find((g) => g.id === currentGroupId);

  const slackEnabled = !!activeGroup?.slackEnabled;
  return { activeGroup, slackEnabled };
}
