import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(
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

    const existingSoal = await prisma.soal.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            userSoal: true,
          },
        },
      },
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

    if (existingSoal._count.userSoal > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete soal",
          error: "This soal has associated user attempts and cannot be deleted",
        },
        { status: 409 }
      );
    }

    await prisma.soal.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Soal deleted successfully",
        data: {
          id: existingSoal.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting soal:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

      if (error.code === "P2003") {
        return NextResponse.json(
          {
            success: false,
            message: "Cannot delete soal",
            error: "This soal is referenced by other records",
          },
          { status: 409 }
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
