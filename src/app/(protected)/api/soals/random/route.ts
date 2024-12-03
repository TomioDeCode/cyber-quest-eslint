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

    const unattemptedSoal = await prisma.soal.findMany({
      where: {
        userSoal: {
          none: {
            userId,
          },
        },
      },
      take: 4,
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(unattemptedSoal);
  } catch (error) {
    console.error("Error fetching random soal:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching soal" },
      { status: 500 }
    );
  }
}
