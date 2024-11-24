"use client";

import * as React from "react";
import { NavMain } from "@/components/common/NavMain";
import { NavUser } from "@/components/common/NavUser";
import { TeamSwitcher } from "@/components/common/TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { fetchRole } from "@/helpers/fetchRole";
import { urlNavbarAdmin } from "@/helpers/url-navbar-admin";
import { urlNavbarUsers } from "@/helpers/url-navbar-users";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadRole = async () => {
      const fetchedRole = await fetchRole();
      setRole(fetchedRole);
    };

    loadRole();
  }, []);

  const navItems =
    role === "admin" ? urlNavbarAdmin.navMain : urlNavbarUsers.navMain;
    
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={urlNavbarUsers.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={urlNavbarUsers.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
