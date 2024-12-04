/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Sesuaikan path ke konfigurasi auth Anda

export async function GET(request: Request) {
  try {
    // Dapatkan sesi pengguna saat ini
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized" 
        }, 
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Konversi searchParams ke objek
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const searchQuery = params.search?.trim() || "";
    const categories = params.categories
      ? params.categories.split(",").map((c) => c.trim())
      : [];
    const excludeSolved = params.excludeSolved === "true";

    const soals = await prisma.soal.findMany({
      where: {
        // Filter untuk soal yang belum diselesaikan oleh pengguna saat ini
        ...(excludeSolved
          ? {
              userSoal: {
                none: {
                  userId: session.user.id,
                  isSolved: true
                }
              }
            }
          : {}),
        
        // Filter berdasarkan kategori jika ada
        ...(categories.length > 0 
          ? { category: { in: categories } } 
          : {}),
        
        // Filter berdasarkan query pencarian jika ada
        ...(searchQuery
          ? {
              OR: [
                { soal: { contains: searchQuery, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        userSoal: {
          where: {
            userId: session.user.id
          },
          select: {
            id: true,
            isSolved: true,
            takenAt: true
          }
        },
        _count: {
          select: {
            userSoal: true
          }
        }
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Transform soals untuk menambahkan informasi tambahan
    const transformedSoals = soals.map(soal => ({
      ...soal,
      attemptCount: soal._count.userSoal,
      userAttempt: soal.userSoal.length > 0 ? soal.userSoal[0] : null,
      // Hapus field yang tidak diperlukan
      userSoal: undefined,
      _count: undefined
    }));

    // Jika tidak ada soal ditemukan
    if (transformedSoals.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada soal yang tersedia",
          data: null,
        },
        { status: 404 }
      );
    }

    // Kembalikan soal yang berhasil ditemukan
    return NextResponse.json(
      {
        success: true,
        message: "Soal berhasil diambil",
        data: transformedSoals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/soals:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}