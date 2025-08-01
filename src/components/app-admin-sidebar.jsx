'use client';
import { useState } from 'react';
import {
  LogOut,
  Sun,
  Moon,
  MonitorCog,
  Settings,
  CalendarCog,
  UserCog,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { SignOutDialog } from '@/components/dialogs/sign-out-dialog';

export function AppAdminSidebar({ activeSection, setActiveSection, ...props }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'users'}
                  size='lg'
                  onClick={() => setActiveSection('users')}
                >
                  <UserCog /> Manage Users
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'semesters'}
                  size='lg'
                  onClick={() => setActiveSection('semesters')}
                >
                  <CalendarCog /> Manage Semesters
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'groups'}
                  size='lg'
                  onClick={() => setActiveSection('groups')}
                >
                  <Users /> Manage Groups
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      <SignOutDialog
        open={showSignOutDialog}
        onOpenChange={setShowSignOutDialog}
        onConfirmSignOut={handleSignOut}
      />
      <Separator />
      <SidebarFooter>
        <SidebarMenuButton onClick={() => router.replace('/main')}>
          <LayoutDashboard /> User Dashboard
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
