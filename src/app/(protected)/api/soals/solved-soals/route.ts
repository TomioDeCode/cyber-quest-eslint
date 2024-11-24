import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const solvedSoals = await prisma.userSoal.findMany({
      where: {
        userId: userId,
      },
      include: {
        soal: true,
      },
      orderBy: {
        takenAt: "desc",
      },
    });

    const formattedSolvedSoals = solvedSoals.map((userSoal) => ({
      ...userSoal.soal,
      solvedAt: userSoal.takenAt,
    }));

    return NextResponse.json(formattedSolvedSoals, { status: 200 });
  } catch (error) {
    console.error("Error fetching solved soals:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve solved soals",
        error: error,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
