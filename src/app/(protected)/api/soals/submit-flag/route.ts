import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { soalId, flag } = body;

    if (!soalId || !flag) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const soal = await prisma.soal.findUnique({
      where: {
        id: soalId,
      },
    });

    if (!soal) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const existingSubmission = await prisma.userSoal.findUnique({
      where: {
        userId_soalId: {
          userId: user.id,
          soalId: soalId,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You have already solved this challenge" },
        { status: 400 }
      );
    }

    if (flag !== soal.flag) {
      return NextResponse.json({ error: "Incorrect flag" }, { status: 400 });
    }

    await prisma.userSoal.create({
      data: {
        userId: user.id,
        soalId: soalId,
        takenAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      { message: "Flag correct! Challenge completed." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting flag:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
