import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalSoal = await prisma.soal.count();

    const completedSoal = await prisma.userSoal.count({
      where: {
        userId: userId,
      },
    });

    const completionPercentage =
      totalSoal > 0 ? ((completedSoal / totalSoal) * 100).toFixed(2) : "100.00";

    const recentCompletions = await prisma.userSoal.findMany({
      where: {
        userId: userId,
      },
      include: {
        soal: true,
      },
      orderBy: {
        takenAt: "desc",
      },
      take: 3,
    });

    const favoriteChallenges = await prisma.userSoal.findMany({
      where: {
        userId: userId,
        soal: {
          isFavorite: true,
        },
      },
      include: {
        soal: true,
      },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await prisma.userSoal.groupBy({
      by: ["takenAt"],
      where: {
        userId: userId,
        takenAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: true,
    });

    const statistics = {
      totalChallenges: totalSoal,
      completedChallenges: completedSoal,
      completionPercentage: completionPercentage,
      recentCompletions: recentCompletions.map((completion) => ({
        soalId: completion.soalId,
        soalName: completion.soal.soal,
        completedAt: completion.takenAt,
      })),
      favoriteChallengesCompleted: favoriteChallenges.map((fc) => ({
        soalId: fc.soalId,
        soalName: fc.soal.soal,
      })),
      dailyCompletionStats: dailyStats.map((stat) => ({
        date: stat.takenAt.toISOString().split("T")[0],
        count: stat._count,
      })),
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
