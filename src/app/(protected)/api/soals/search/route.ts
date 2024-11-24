import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { q } = req.query;

    const soals = await prisma.soal.findMany({
      where: {
        OR: [
          {
            soal: {
              contains: q as string,
              mode: "insensitive",
            },
          },
          {
            url: {
              contains: q as string,
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

    return res.status(200).json({
      success: true,
      message: "Soals retrieved successfully",
      data: soals.map((soal) => ({
        ...soal,
        attemptCount: soal._count.userSoal,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching soals",
    });
  }
}
