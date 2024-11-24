"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const LoadingSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-muted">
      <div className="border-b bg-background shadow-sm">
        <div className="h-16 max-w-7xl mx-auto px-4 flex items-center">
          <div className="w-32 h-8 bg-muted/80 animate-pulse rounded"></div>
          <div className="ml-auto flex space-x-4">
            <div className="w-24 h-8 bg-muted/80 animate-pulse rounded"></div>
            <div className="w-8 h-8 bg-muted/80 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm border border-border"
            >
              <div className="space-y-4">
                <div className="w-3/4 h-4 bg-muted animate-pulse rounded-[var(--radius)]"></div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-muted animate-pulse rounded-[var(--radius)]"></div>
                  <div className="w-5/6 h-3 bg-muted animate-pulse rounded-[var(--radius)]"></div>
                  <div className="w-4/6 h-3 bg-muted animate-pulse rounded-[var(--radius)]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function AuthGuard({ children, allowedRoles = [] }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(session.user.role)
    ) {
      router.push("/unauthorized");
    }
  }, [session, status, router, allowedRoles]);

  if (status === "loading") {
    return <LoadingSkeleton />;
  }

  if (!session) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return null;
  }

  return <>{children}</>;
}
