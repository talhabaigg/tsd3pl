import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "../components/ui/sidebar";
import ApplicationLogo from "~/components/application-logo";
import { Link, usePage } from "@inertiajs/react";
import { useToggle } from "@uidotdev/usehooks";
import { NavUser } from "./nav-user";
import { LayoutDashboard, Ticket } from "lucide-react";
export function AppSidebar() {
  const user = usePage().props.auth.user;
  const isLinkActive = (link: string) => {
    const currentUrl = window.location.href; // Full URL including domain
    return currentUrl === link; // Compare with the provided route link
  };

  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader>
      <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="flex justify-center" asChild>
                          <Link href={route("dashboard")} >
                          <div className="mr-2">
                            <ApplicationLogo  />
                          </div>
                          
                          </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
       
      </SidebarHeader>
      <SidebarContent className="px-2">
        {/* <SidebarMenuButton
          asChild
          tooltip="Dashboard"
          className="-mb-1"
          isActive={isLinkActive(route("dashboard"))}
        >
          <Link href={route("dashboard")} className="flex items-center">
            <LayoutDashboard />
            Dashboard
          </Link>
        </SidebarMenuButton> */}
        <SidebarMenuButton
          asChild
          tooltip="Issues"
          isActive={isLinkActive(route("issue.index"))}
        >
          <Link href={route("issue.index")} className="flex items-center">
            <Ticket />
            Issues
          </Link>
        </SidebarMenuButton>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu></SidebarMenu>
        <NavUser user={user}/>
      </SidebarFooter>
    </Sidebar>
  );
}
