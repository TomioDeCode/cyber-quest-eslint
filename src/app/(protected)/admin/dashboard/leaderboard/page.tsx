"use client";

import dynamic from "next/dynamic";

const LeaderboardPage = dynamic(() => import("@/components/fragments/LeaderboardPage"), {
  ssr: false,
});

export default LeaderboardPage;
