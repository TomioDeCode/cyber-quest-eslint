"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

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

  if (!session) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return null;
  }

  return <>{children}</>;
}
