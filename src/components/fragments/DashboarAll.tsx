/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

type Soal = {
  id: string;
  soal: string;
  url: string;
};

import React, { useState, useEffect } from "react";
import { Trophy, Target, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progres, setProgres] = useState<any>(0);
  const [leaderboard, setLeaderboard] = useState<any>(0);
  const session = useSession();

  const sessionData = session.data?.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [soalsResponse, progresResponse, leaderboardResponse] =
          await Promise.all([
            fetch(`/api/soals/random?userId=${sessionData?.id}`),
            fetch(`/api/soals/completed?userId=${sessionData?.id}`),
            sessionData?.role === "user"
              ? fetch(`/api/leaderboard/user?userId=${sessionData?.id}`)
              : null,
          ]);

        const soalsData = await soalsResponse.json();
        const progresData = await progresResponse.json();
        const leaderboardData = leaderboardResponse
          ? await leaderboardResponse.json()
          : null;

        setSoalList(soalsData);
        setProgres(progresData);
        if (leaderboardData) setLeaderboard(leaderboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="max-h-[100vh] h-full p-6 space-y-8 bg-gray-50 dark:bg-gray-900 overflow-auto flex flex-col">
      {sessionData?.name ? (
        <WelcomeSection userName={sessionData?.name} />
      ) : (
        <WelcomeSection userName={"User"} />
      )}
      {sessionData?.role ? (
        <StatsSection
          progres={progres}
          soalCount={soalList.length}
          leaderboardRank={leaderboard.rank}
          userRole={sessionData?.role}
        />
      ) : (
        <StatsSection
          progres={progres}
          soalCount={soalList.length}
          leaderboardRank={leaderboard.rank}
          userRole={"user"}
        />
      )}
      <ChallengesSection soalList={soalList} />
    </div>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center text-red-500">
        <p className="font-semibold">Error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    </div>
  </div>
);

const WelcomeSection = ({ userName }: { userName: string }) => (
  <div className="space-y-2">
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
      Welcome back,{" "}
      <span className="text-blue-600 dark:text-blue-400">{userName}</span>
    </h1>
    <p className="text-gray-600 dark:text-gray-400">
      Your coding journey continues. Ready for today&apos;s challenges?
    </p>
  </div>
);

const StatsSection = ({
  progres,
  soalCount,
  leaderboardRank,
  userRole,
}: {
  progres: any;
  soalCount: number;
  leaderboardRank: number;
  userRole: string;
}) => (
  <div
    className={`grid gap-6 md:grid-cols-2 ${
      userRole === "admin" ? "lg:grid-cols-2" : "lg:grid-cols-3"
    }`}
  >
    <StatCard
      icon={<Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      title="Problems Solved"
      value={progres?.completedSoalCount}
    />
    <StatCard
      icon={<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      title="Available Problems"
      value={soalCount}
    />
    {userRole === "user" && (
      <StatCard
        icon={<Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        title="Leaderboard Rank"
        value={`#${leaderboardRank}`}
      />
    )}
  </div>
);

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) => (
  <div className="p-6 min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
    </div>
  </div>
);

const ChallengesSection = ({ soalList }: { soalList: Soal[] }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
      Today&apos;s Challenges
    </h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {soalList && soalList.length > 0 ? (
        soalList.map((soal) => <ChallengeCard key={soal.id} soal={soal} />)
      ) : (
        <div className="col-span-full text-center text-gray-600">
          There are no questions yet, they are not finished.
        </div>
      )}
    </div>
  </div>
);

const ChallengeCard = ({ soal }: { soal: Soal }) => (
  <div className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
    <div className="space-y-4 min-h-[160px] flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
          {soal.soal}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{soal.url}</p>
      </div>
      <a
        href={soal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 w-full"
      >
        <span>Start Challenge</span>
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  </div>
);

export default Dashboard;
