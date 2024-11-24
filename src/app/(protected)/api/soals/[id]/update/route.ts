import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PUT(
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

    const data = await request.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No data provided",
          error: "Update data is required",
        },
        { status: 400 }
      );
    }

    if (data.url) {
      try {
        new URL(data.url);
      } catch (e) {
        if (e instanceof Error) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid URL format",
              error: "Please provide a valid URL",
            },
            { status: 400 }
          );
        }
      }
    }

    const existingSoal = await prisma.soal.findUnique({
      where: { id },
    });

    if (!existingSoal) {
      return NextResponse.json(
        {
          success: false,
          message: "Soal not found",
          error: "The specified soal does not exist",
        },
        { status: 404 }
      );
    }

    const updateSoal = await prisma.soal.update({
      where: { id },
      data: {
        url: data.url?.trim(),
      },
      select: {
        id: true,
        soal: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Soal updated successfully",
        data: updateSoal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating soal:", error);

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
