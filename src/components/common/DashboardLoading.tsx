"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => (
  <div className="max-h-[100vh] h-full p-6 space-y-8 bg-gray-50 dark:bg-gray-900 overflow-auto flex flex-col">
    {/* Welcome Section Skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-10 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2" />
    </div>

    {/* Stats Section Skeleton */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-6 min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <Skeleton className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12" />
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Challenges Section Skeleton */}
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-4 min-h-[160px] flex flex-col justify-between">
              <div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardLoading;
