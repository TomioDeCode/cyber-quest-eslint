/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search")?.trim() || "";
    const categories =
      searchParams
        .get("categories")
        ?.split(",")
        .map((c) => c.trim()) || [];

    const soals = await prisma.soal.findMany({
      where: {
        ...(searchQuery
          ? {
              OR: [
                { soal: { contains: searchQuery, mode: "insensitive" } },
                {
                  userSoal: {
                    some: {
                      user: {
                        OR: [
                          {
                            name: {
                              contains: searchQuery,
                              mode: "insensitive",
                            },
                          },
                          {
                            email: {
                              contains: searchQuery,
                              mode: "insensitive",
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            }
          : {}),
        ...(categories.length > 0 ? { category: { in: categories } } : {}),
      },
      select: {
        id: true,
        soal: true,
        url: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        userSoal: {
          select: {
            id: true,
            takenAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            userSoal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!soals || soals.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            searchQuery || categories.length > 0
              ? `No soals found matching search "${searchQuery}" and categories ${categories.join(
                  ", "
                )}`
              : "No soals found",
          data: null,
        },
        { status: 404 }
      );
    }

    const transformedSoals = soals.map(
      (soal: { _count: { userSoal: any }; userSoal: any[] }) => ({
        ...soal,
        attemptCount: soal._count.userSoal,
        userSoal: soal.userSoal.map((us) => ({
          id: us.id,
          takenAt: us.takenAt,
          user: us.user,
        })),
      })
    );

    return NextResponse.json(
      {
        success: true,
        message:
          searchQuery || categories.length > 0
            ? `Soals retrieved successfully for search: "${searchQuery}" and categories ${categories.join(
                ", "
              )}`
            : "Soals retrieved successfully",
        data: transformedSoals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/soals:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
