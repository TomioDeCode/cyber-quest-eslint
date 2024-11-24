import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

interface Activity {
  type: string;
  details?: string;
  questionTitle?: string;
  solvedAt?: Date;
  timestamp?: Date;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [loginActivities, questionActivities] = await Promise.all([
      prisma.session.findMany({
        where: { userId },
        orderBy: { expires: "desc" },
        take: 1,
        select: {
          id: true,
          expires: true,
          user: { select: { name: true } },
        },
      }),
      prisma.userSoal.findMany({
        where: { userId },
        include: {
          soal: { select: { soal: true, flag: true, userSoal: true } },
        },
        orderBy: { takenAt: "desc" },
        take: 3,
      }),
    ]);

    const userActivities: Activity[] = [
      ...loginActivities.map((session) => ({
        type: "login",
        details: `Login session`,
        solvedAt: session.expires,
      })),
      ...questionActivities.map((activity) => ({
        type: "question_solved",
        questionTitle: activity.soal.soal,
        solvedAt: activity.takenAt,
      })),
    ];

    const sortedActivities = userActivities.sort(
      (a, b) =>
        new Date(b.solvedAt!).getDate() - new Date(a.solvedAt!).getDate()
    );

    return NextResponse.json(
      {
        lastLogin:
          sortedActivities.find((a) => a.type === "login")?.solvedAt || null,
        totalActivities: sortedActivities.length,
        recentActivities: sortedActivities.slice(0, 10),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user activities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
