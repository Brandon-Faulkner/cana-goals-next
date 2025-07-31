'use client';
import { useState } from 'react';
import {
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  MonitorCog,
  Settings,
  SquarePen,
  Globe,
  CalendarPlus,
  ArrowLeftRight,
  LayoutDashboard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { GoalLanguageDialog } from '@/components/dialogs/goal-language-dialog';
import { VersionNotesDialog } from '@/components/dialogs/version-notest-dialog';
import { AddSemesterDialog } from '@/components/dialogs/add-semester-dialog';
import { SwitchGroupDialog } from '@/components/dialogs/switch-group-dialog';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { SignOutDialog } from '@/components/dialogs/sign-out-dialog';
import { useAuth } from '@/contexts/auth-context';
import { useSemesters } from '@/contexts/semesters-context';
import { useGroups } from '@/contexts/groups-context';

export function AppSidebar({
  semesters = [],
  loadingSemesters = false,
  currentSemester,
  onSelectSemester,
  usersInCurrentSemester = [],
  onUserSelect,
  ...props
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { userDoc } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();
  const { currentGroupId } = useSemesters();
  const { isMobile, setOpenMobile } = useSidebar();
  const [showGoalLanguage, setShowGoalLanguage] = useState(false);
  const [showVersionNotes, setShowVersionNotes] = useState(false);
  const [showAddSemester, setShowAddSemester] = useState(false);
  const [showSwitchGroup, setShowSwitchGroup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const isAdmin = userDoc?.admin;

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace('/login');
      })
      .catch((error) => {
        toast.error('Error signing out: ' + error.message);
      });
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className='flex h-[47px] items-center gap-1'>
          <Image
            src='/cana-goals-transparent.png'
            alt='Cana Goals main logo'
            width={32}
            height={32}
          />
          <span className='text-xl font-semibold'>Cana Goals</span>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className='gap-0'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger
                    className='w-full px-2 text-lg'
                    size='lg'
                    aria-label='Change theme'
                  >
                    <SelectValue>
                      <div className='flex items-center gap-2'>
                        {theme === 'light' ? <Sun /> : theme === 'dark' ? <Moon /> : <MonitorCog />}
                        <span>
                          {theme === 'light'
                            ? 'Light Mode'
                            : theme === 'dark'
                              ? 'Dark Mode'
                              : 'System Theme'}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align='start'>
                    <SelectItem value='light'>
                      <div className='flex items-center gap-2'>
                        <Sun className='mr-2 h-4 w-4' />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value='dark'>
                      <div className='flex items-center gap-2'>
                        <Moon className='mr-2 h-4 w-4' />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value='system'>
                      <div className='flex items-center gap-2'>
                        <MonitorCog className='mr-2 h-4 w-4' />
                        <span>System</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size='lg' onClick={() => setShowVersionNotes(true)}>
                  <SquarePen /> What&apos;s New
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size='lg' onClick={() => setShowGoalLanguage(true)}>
                  <Globe /> Goal Language
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton size='lg' onClick={() => setShowAddSemester(true)}>
                    <CalendarPlus /> Add Semester
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <Collapsible defaultOpen className='group/collapsible'>
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              tooltip='Show/Hide available semesters'
              className='group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-lg'
            >
              <CollapsibleTrigger>
                Goal Semesters
                <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenuSub>
                  {loadingSemesters
                    ? [...Array(3)].map((_, i) => (
                        <SidebarMenuSubItem key={i}>
                          <SidebarMenuSubButton disabled className='animate-pulse opacity-50'>
                            Loading...
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))
                    : semesters.map((semester) => (
                        <SidebarMenuSubItem key={semester.id}>
                          <SidebarMenuSubButton
                            isActive={currentSemester?.id === semester.id}
                            tooltip={
                              currentSemester?.id === semester.id
                                ? 'Current selected semester'
                                : 'Click to view semester'
                            }
                            size='lg'
                            onClick={() => onSelectSemester(semester)}
                            className={'cursor-pointer'}
                          >
                            {semester.semester}
                          </SidebarMenuSubButton>
                          {/* Display users if this is the current semester and users exist */}
                          {currentSemester?.id === semester.id &&
                            usersInCurrentSemester &&
                            usersInCurrentSemester.length > 0 && (
                              <SidebarMenuSub>
                                {usersInCurrentSemester.map((person) => (
                                  <SidebarMenuSubItem
                                    key={person.id}
                                    tooltip={`View ${person.name}'s goals`}
                                  >
                                    <SidebarMenuSubButton
                                      onClick={() => {
                                        if (onUserSelect) {
                                          onUserSelect(person.id);
                                        }
                                        if (isMobile) {
                                          setOpenMobile(false);
                                        }
                                      }}
                                    >
                                      {person.name}
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                        </SidebarMenuSubItem>
                      ))}
                </SidebarMenuSub>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <GoalLanguageDialog open={showGoalLanguage} onOpenChange={setShowGoalLanguage} />
      <VersionNotesDialog open={showVersionNotes} onOpenChange={setShowVersionNotes} />
      <AddSemesterDialog
        open={showAddSemester}
        onOpenChange={setShowAddSemester}
        isAdmin={isAdmin}
      />
      <SwitchGroupDialog open={showSwitchGroup} onOpenChange={setShowSwitchGroup} />
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      <SignOutDialog
        open={showSignOutDialog}
        onOpenChange={setShowSignOutDialog}
        onConfirmSignOut={handleSignOut}
      />
      <Separator />
      <SidebarFooter>
        {isAdmin && (
          <SidebarMenuButton onClick={() => router.replace('/admin')}>
            <LayoutDashboard /> Admin Dashboard
          </SidebarMenuButton>
        )}
        <SidebarMenuButton
          tooltip='Switch between your assigned groups'
          onClick={() => setShowSwitchGroup(true)}
        >
          <ArrowLeftRight /> Switch Group
          {groupsLoading ? (
            <SidebarMenuBadge className='bg-muted text-muted-foreground mr-2'>
              Loading...
            </SidebarMenuBadge>
          ) : groups?.length > 0 && currentGroupId ? (
            <SidebarMenuBadge className='bg-primary text-primary-foreground mr-2 shadow-lg'>
              {groups.find((g) => g.id === currentGroupId)?.name}
            </SidebarMenuBadge>
          ) : null}
        </SidebarMenuButton>
        <SidebarMenuButton onClick={() => setShowSettings(true)}>
          <Settings /> Settings
        </SidebarMenuButton>
        <Button type='button' variant='destructive' onClick={() => setShowSignOutDialog(true)}>
          <LogOut /> Sign Out
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
