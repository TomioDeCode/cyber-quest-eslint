import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    if (
      !id ||
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (typeof body.isFavorite !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid favorite status" },
        { status: 400 }
      );
    }

    const updatedSoal = await prisma.soal.update({
      where: { id },
      data: {
        isFavorite: body.isFavorite,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        isFavorite: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...updatedSoal,
          isFavorite: Boolean(updatedSoal.isFavorite),
        },
        message: "Favorite status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating favorite status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update favorite status",
      },
      { status: 500 }
    );
  }
}
