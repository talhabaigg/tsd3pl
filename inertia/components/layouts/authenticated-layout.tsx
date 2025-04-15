// src/components/Layout.tsx
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { Toaster } from "~/components/ui/sonner";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Link, usePage } from "@inertiajs/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import ThemeToggle from "../widgets/theme-toggle";
import { Breadcrumbs } from "~/components/custom-breadcrumbs"; // Import Breadcrumbs component
import { toast } from "sonner";

function Layout({ children }: { children: React.ReactNode }) {
  const { url } = usePage(); // Get the current page's URL
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { auth } = usePage().props;
  const isAdmin: boolean = Boolean(auth.user.isAdmin); // Ensure isAdmin is explicitly a boolean
  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("sidebar:state") === "true",
  );

  useEffect(() => {
    // Check if a theme is saved in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  
  const handleSidebarStateChange = (state: boolean) => {
    setSidebarOpen(state);
    localStorage.setItem("sidebar:state", String(state));
  };

  // Set dynamic breadcrumbs based on the URL
  // Set dynamic breadcrumbs based on the URL
  const breadcrumbs = [
    ...(url.includes("issue") // Check if the current URL includes "issue"
      ? [
          {
            label: "Issues",
            route: "issue.index",
            isActive: url.includes("issue"),
          },
        ]
      : []),
    ...(url.includes("profile") // Check if the current URL includes "profile"
      ? [
          {
            label: "Profile",
            route: "profile.index",
            isActive: url.includes("profile"),
          },
        ]
      : []),
    ...(url.includes("users") // Check if the current URL includes "users"
      ? [
          {
            label: "Users",
            route: "users.index",
            isActive: url.includes("users") && !url.includes("create"), // Ensures "Users" shows on the index page, not on "create"
          },
          // Only show "Create" if the URL contains "create"
          ...(url.includes("create")
            ? [
                {
                  label: "Create",
                  route: "users.create",
                  isActive: true, // Active when on the create page
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <SidebarProvider onOpenChange={handleSidebarStateChange} open={sidebarOpen}>
      <AppSidebar />
      <main className="p-2 w-full">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* Use the Breadcrumbs component here */}
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <div>
            <Sheet>
              {/* <SheetTrigger>
                <Button variant="ghost" size="icon">
                  <Bell />
                </Button>
              </SheetTrigger> */}
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>No new notifications</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </main>
      <Toaster richColors />
    </SidebarProvider>
  );
}

export default Layout;
