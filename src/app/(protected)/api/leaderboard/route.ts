import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        _count: {
          select: {
            userSoal: true,
          },
        },
      },
      orderBy: {
        userSoal: {
          _count: "desc",
        },
      },
      skip,
      take: limit,
    });

    const total = await prisma.user.count();

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: skip + index + 1,
      id: user.id,
      name: user.name || "Anonymous",
      email: user.email,
      image: user.image,
      solvedCount: user._count.userSoal,
    }));

    return NextResponse.json({
      status: "success",
      data: {
        leaderboard: formattedLeaderboard,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch leaderboard",
      },
      { status: 500 }
    );
  }
}
