import { useState } from "react";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  Users, 
  Bed, 
  Settings, 
  ClipboardList,
  CreditCard,
  Home,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    group: "Overview"
  },
  {
    title: "Room Plan",
    url: "/rooms",
    icon: Building2,
    group: "Operations"
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: Calendar,
    group: "Operations"
  },
  {
    title: "Guests",
    url: "/guests",
    icon: Users,
    group: "Operations"
  },
  {
    title: "Housekeeping",
    url: "/housekeeping",
    icon: ClipboardList,
    group: "Operations"
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
    group: "Finance"
  },
  {
    title: "Room Types",
    url: "/room-types",
    icon: Bed,
    group: "Settings"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    group: "Settings"
  }
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavClassName = (url: string) => {
    const isActive = currentPath === url;
    return isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  // Group items
  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar
      className={!open ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Hotel Logo/Name */}
        <div className="p-4 border-b">
          {open && (
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <h2 className="font-semibold text-lg">Hotel PMS</h2>
            </div>
          )}
          {!open && (
            <div className="flex justify-center">
              <Home className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>

        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            {open && (
              <SidebarGroupLabel className="text-xs uppercase tracking-wider">
                {groupName}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-5 w-5" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* User Section */}
        <div className="mt-auto p-4 border-t">
          {open && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>User Account</span>
            </div>
          )}
          {!open && (
            <div className="flex justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}