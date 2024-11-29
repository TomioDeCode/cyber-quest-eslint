"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  rank: number;
  id: string;
  name: string;
  email: string;
  image: string | null;
  solvedCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeaderboardData {
  leaderboard: User[];
  pagination: Pagination;
}

interface ApiResponse {
  status: string;
  data: LeaderboardData;
}

const LeaderboardPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (page: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/leaderboard?page=${page}&limit=5`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data: ApiResponse = await response.json();
      if (data.status === "success") {
        setLeaderboardData(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(currentPage);
  }, [currentPage]);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRankBadgeColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-transparent";
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(10)].map((_, idx) => (
        <div key={idx} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p className="text-lg">Error: {error}</p>
              <button
                onClick={() => fetchLeaderboard(currentPage)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-2xl -mt-2">
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center uppercase">
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="rounded-md border p-5">
                <Table className="w-full max-w-screen-2xl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">
                        <span className="hidden lg:inline">
                          Solved Problems
                        </span>
                        <span className="inline lg:hidden ">Solved</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData?.leaderboard.map((user: User) => (
                      <TableRow key={user.id} className="mt-2">
                        <TableCell>
                          <Badge
                            className={`hover:bg-transparent ${getRankBadgeColor(
                              user.rank
                            )} text-white`}
                          >
                            #{user.rank}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={user.image || undefined}
                                alt={user.name}
                              />
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500 hidden md:inline">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right flex justify-end items-center mt-3">
                          <Badge
                            variant="secondary"
                            className="flex items-center justify-center w-10"
                          >
                            {user.solvedCount}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {leaderboardData && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                        href="#"
                      />
                    </PaginationItem>
                    {[
                      ...Array(
                        Math.min(5, leaderboardData.pagination.totalPages)
                      ),
                    ].map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          isActive={currentPage === idx + 1}
                          onClick={() => setCurrentPage(idx + 1)}
                          href="#"
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {leaderboardData.pagination.totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              leaderboardData.pagination.totalPages,
                              prev + 1
                            )
                          )
                        }
                        className={
                          currentPage === leaderboardData.pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
