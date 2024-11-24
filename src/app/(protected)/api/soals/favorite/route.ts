/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function GET(
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const favorites = await prisma.soal.findMany({
      where: { isFavorite: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch favorites",
      },
      { status: 500 }
    );
  }
}
