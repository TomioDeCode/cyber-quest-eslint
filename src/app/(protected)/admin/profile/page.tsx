"use client";

import UserDetailsView from "@/components/fragments/UserDetailsView";
import UserActivityView from "@/components/fragments/Riwayat";
import UserStatisticsPage from "@/components/fragments/StaticPage";
import { useSession } from "next-auth/react";
import React from "react";

const UserDashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <p className="text-red-600 text-lg">
          Please log in to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="w-full md:w-1/2">
            <UserDetailsView userId={session?.user.id || ""} />
          </div>
          <div className="hidden md:block w-full md:w-1/2 xl:w-full">
            <UserActivityView />
          </div>
        </div>
      </div>
      <div>
        <UserStatisticsPage />
      </div>
    </div>
  );
};

export default UserDashboardPage;
