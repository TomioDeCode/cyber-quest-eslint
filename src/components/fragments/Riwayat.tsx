"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Flag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  type: string;
  details?: string;
  questionTitle?: string;
  solvedAt: Date;
}

const UserActivitySkeleton = () => (
  <Card className="w-full h-[450px]">
    <CardContent className="pt-6 flex items-center justify-center h-full">
      <div className="space-y-4 w-full">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const UserActivityView = () => {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<{
    lastLogin: Date | null;
    totalActivities: number;
    recentActivities: ActivityItem[];
  }>({
    lastLogin: null,
    totalActivities: 0,
    recentActivities: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/users/user-activity", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivities();
  }, [session]);

  if (isLoading) return <UserActivitySkeleton />;
  if (error)
    return (
      <Card className="w-full h-[450px] bg-red-50">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-red-600 text-center">{error}</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full h-[450px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Activity History
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        {activities.recentActivities.length === 0 ? (
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            No recent activities
          </div>
        ) : (
          <div className="space-y-4">
            {activities.recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-sm border-white border transition-colors"
              >
                <div className="flex-1 mr-4">
                  <div className="font-medium text-sm truncate">
                    {activity.questionTitle || activity.details}
                  </div>
                  <Badge
                    variant="outline"
                    className="-ml-1 mt-2 rounded-sm uppercase"
                  >
                    <Flag className="w-3 h-3 mr-1" /> {activity.type}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.solvedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityView;
