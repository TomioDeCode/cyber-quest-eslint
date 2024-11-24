"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import UserStatisticsDashboard from "@/components/common/StatiticUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface Completion {
  soalId: string;
  soalName: string;
  completedAt: string;
}

interface DailyStats {
  date: string;
  count: number;
}

interface Statistics {
  totalChallenges: number;
  completedChallenges: number;
  completionPercentage: string;
  recentCompletions: Completion[];
  favoriteChallengesCompleted: { soalId: string; soalName: string }[];
  dailyCompletionStats: DailyStats[];
}

const UserStatisticsPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = React.useMemo(() => {
    const pathId = pathname.split("/").pop();
    const searchId = searchParams.get("userId");
    return pathId || searchId || "";
  }, [pathname, searchParams]);

  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  useEffect(() => {
    const fetchUserStatistics = async () => {
      const userId = session.data?.user.id;

      setIsLoading(true);
      setError(null);
      setStatistics(null);

      if (!userId) {
        setError("User ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/statistics/user/${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user statistics");
        }

        const data: Statistics = await response.json();

        if (data && typeof data === "object") {
          setStatistics(data);
        } else {
          throw new Error("Invalid data structure received");
        }
      } catch (err) {
        console.error("Error fetching user statistics:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserStatistics();
    }
  }, [session.data?.user.id, userId]);

  const LoadingSkeleton = () => (
    <div className="p-4 space-y-6">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[400px] w-full" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Unable to load user statistics"}
        </AlertDescription>
      </Alert>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  if (!statistics) return <ErrorState />;

  return <UserStatisticsDashboard statistics={statistics} />;
};

export default UserStatisticsPage;
