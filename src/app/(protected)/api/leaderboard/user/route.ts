import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        NOT: {
          role: "admin",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            userSoal: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedCount = user._count.userSoal;

    const rank = await prisma.$queryRaw<{ rank: number }[]>`
            SELECT COUNT(*) AS rank
            FROM users u
            LEFT JOIN user_soals us ON u.id = us."userId"
            WHERE u.role != 'admin'
            GROUP BY u.id
            HAVING COUNT(us."soalId") >= ${completedCount};
        `;

    const result = {
      rank: rank.length,
      id: user.id,
      name: user.name || "Anonymous",
      email: user.email,
      completedCount,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching user leaderboard data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching leaderboard data" },
      { status: 500 }
    );
  }
}
