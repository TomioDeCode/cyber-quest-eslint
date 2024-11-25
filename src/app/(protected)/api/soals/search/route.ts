import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is required",
        },
        { status: 400 }
      );
    }

    const soals = await prisma.soal.findMany({
      where: {
        OR: [
          {
            soal: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            url: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        _count: {
          select: { userSoal: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Soals retrieved successfully",
        data: soals.map((soal) => ({
          ...soal,
          attemptCount: soal._count.userSoal,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while searching soals",
      },
      { status: 500 }
    );
  }
}
