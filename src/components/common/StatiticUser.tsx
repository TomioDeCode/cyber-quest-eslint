"use client";

interface Completion {
  soalId: string;
  soalName: string;
  completedAt: string;
}

interface DailyStats {
  date: string;
  count: number;
}

interface FavoriteChallenge {
  soalId: string;
  soalName: string;
}

interface Statistics {
  totalChallenges: number;
  completedChallenges: number;
  completionPercentage: string;
  recentCompletions: Completion[];
  favoriteChallengesCompleted: FavoriteChallenge[];
  dailyCompletionStats: DailyStats[];
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";
import { Star, Trophy, Clock, TrendingUp } from "lucide-react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface UserStatisticsDashboardProps {
  statistics: Statistics;
}

const UserStatisticsDashboard = ({
  statistics,
}: UserStatisticsDashboardProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: statistics.dailyCompletionStats.map((stat) =>
        new Date(stat.date).toLocaleDateString()
      ),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => Math.round(val).toString(),
      },
    },
    colors: ["#2563eb"],
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
  };

  const chartSeries = [
    {
      name: "Completions",
      data: statistics.dailyCompletionStats.map((stat) => stat.count),
    },
  ];

  return (
    <div className="p-0 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{statistics.completedChallenges} completed</span>
              <span>{statistics.completionPercentage}%</span>
            </div>
            <Progress value={parseFloat(statistics.completionPercentage)} />
            <p className="text-sm text-gray-500">
              {statistics.completedChallenges} out of{" "}
              {statistics.totalChallenges} challenges completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Daily Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-black">
          <div className="h-[350px] w-full">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height="350"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-6 w-6 text-green-500" />
              Recent Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.recentCompletions.map((completion, index) => (
                <div
                  key={completion.soalId + index}
                  className="flex justify-between items-center border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{completion.soalName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(completion.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Favorite Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {statistics.favoriteChallengesCompleted.length > 0 ? (
                <ul
                  className="space-y-1 text-left list-disc pl-5"
                  aria-label="List of completed favorite challenges"
                >
                  {statistics.favoriteChallengesCompleted.map((challenge) => (
                    <li
                      key={challenge.soalId}
                      className="text-sm text-gray-700"
                    >
                      {challenge.soalName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  No favorite challenges have been completed yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserStatisticsDashboard;
