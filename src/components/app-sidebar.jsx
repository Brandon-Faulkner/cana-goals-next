"use client"
import { ChevronRight, LogOut, Sun, Moon, Settings, SquarePen, Globe } from "lucide-react"
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function AppSidebar({
  semesters = [],
  loadingSemesters = false,
  currentSemester,
  onSelectSemester,
  ...props
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const signOutUser = () => {
    signOut(auth).then(() => {
      router.replace('/login');
    }).catch((error) => {
      toast.error("Error signing out: " + error.message);
    })
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-1">
          <Image src="/android-chrome-192x192.png" alt="Cana Goals main logo" width={32} height={32} />
          <span className="text-xl font-semibold">Cana Goals</span>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleTheme} size="lg">
                  {theme === "dark" ? <Sun /> : <Moon />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <SquarePen /> What&apos;s New
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <Globe /> Goal Language
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-lg">
              <CollapsibleTrigger>
                Goal Semesters
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenuSub>
                  {loadingSemesters
                    ? [...Array(3)].map((_, i) => (
                      <SidebarMenuSubItem key={i}>
                        <SidebarMenuSubButton disabled className="animate-pulse opacity-50">
                          Loading...
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                    : semesters.map(semester => (
                      <SidebarMenuSubItem key={semester.id}>
                        <SidebarMenuSubButton
                          isActive={currentSemester?.id === semester.id}
                          size="lg"
                          onClick={() => onSelectSemester(semester)}
                          className={"cursor-pointer"}
                        >
                          {semester.semester}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <Button type="button" variant="ghost" className="justify-start mb-2">
          <Settings /> Settings
        </Button>
        <Button type="button" variant="destructive" onClick={signOutUser}>
          <LogOut /> Sign Out
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
