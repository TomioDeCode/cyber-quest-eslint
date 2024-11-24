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

    const completedSoalCount = await prisma.userSoal.count({
      where: {
        userId,
      },
    });

    return NextResponse.json({ completedSoalCount });
  } catch (error) {
    console.error("Error fetching completed soal count:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching soal count" },
      { status: 500 }
    );
  }
}
