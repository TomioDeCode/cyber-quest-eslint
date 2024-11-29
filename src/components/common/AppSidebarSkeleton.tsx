"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebarSkeleton({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Skeleton className="h-10 w-full" />
      </SidebarHeader>

      <SidebarContent>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-8 w-full" />
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-full flex-grow" />
        </div>
      </SidebarFooter>

      <SidebarRail>
        <Skeleton className="h-full w-full" />
      </SidebarRail>
    </Sidebar>
  );
}
