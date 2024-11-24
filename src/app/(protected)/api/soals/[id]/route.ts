import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID provided",
          error: "A valid ID is required",
        },
        { status: 400 }
      );
    }

    const soal = await prisma.soal.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        soal: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!soal) {
      return NextResponse.json(
        {
          success: false,
          message: "Soal not found",
          error: "The specified soal does not exist",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Soal is found successfully",
        data: soal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error get soal:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        return NextResponse.json(
          {
            success: false,
            message: "Duplicate entry",
            error: `${target.join(", ")} already exists`,
          },
          { status: 400 }
        );
      }

      if (error.code === "P2023") {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid ID format",
            error: "The provided ID is not in the correct format",
          },
          { status: 400 }
        );
      }
    }

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
