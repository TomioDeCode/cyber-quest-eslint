import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          error: "No active session found",
        },
        { status: 401 }
      );
    }

    if (!user.role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
          error: "User has no role assigned",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User role retrieved successfully",
        data: {
          userId: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user role:", error);

    if (error instanceof Error && error.message.includes("session")) {
      return NextResponse.json(
        {
          success: false,
          message: "Session error",
          error: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred",
        error:
          error instanceof Error ? error.message : "Failed to fetch user role",
      },
      { status: 500 }
    );
  }
}
