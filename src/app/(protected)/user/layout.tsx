import React, { Suspense } from "react";
import { AuthGuard } from "@/components/core/AuthGuard";
import { AppSidebar } from "@/components/core/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebarSkeleton } from "@/components/common/AppSidebarSkeleton";

export default function Layout({ children }: { children: React.ReactNode }) {
  function SidebarContent() {
    return <AppSidebar />;
  }
  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Suspense fallback={<AppSidebarSkeleton />}>
          <SidebarContent />
        </Suspense>

        <main
          className={cn(
            "relative flex flex-1 flex-col",
            "overflow-hidden bg-background"
          )}
        >
          <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6 min-h-[calc(100vh-3.5rem)] md:min-h-screen">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
