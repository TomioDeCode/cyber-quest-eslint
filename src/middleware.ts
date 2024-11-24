import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "admin" | "user";

interface AuthConfig {
  adminPaths: string[];
  userPaths: string[];
  publicPaths: string[];
  authPaths: string[];
  publicApiPaths: string[];
  protectedApiPaths: string[];
  loginPath: string;
  adminDashboard: string;
  userDashboard: string;
  unauthorizedPath: string;
}

const authConfig: AuthConfig = {
  adminPaths: ["/admin", "/dashboard/admin"],
  userPaths: ["/dashboard", "/profile"],
  publicPaths: ["/"],
  authPaths: ["/login", "/register"],
  publicApiPaths: ["/api/auth"],
  protectedApiPaths: ["/api/"],
  loginPath: "/login",
  adminDashboard: "/admin/dashboard",
  userDashboard: "/user/dashboard",
  unauthorizedPath: "/unauthorized",
};

/**
 * Helper function untuk mengecek apakah request berasal dari aplikasi kita sendiri
 */

function isValidRequest(request: NextRequest): boolean {
  const appOrigin =
    process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "";

  const referer = request.headers.get("referer");
  const apiKey = request.headers.get("x-api-key");
  const isFromApp = referer?.startsWith(appOrigin);
  const hasValidApiKey = apiKey === process.env.API_SECRET_KEY;

  return isFromApp || hasValidApiKey;
}

/**
 * Helper function untuk mengecek apakah path dimulai dengan salah satu dari paths yang diberikan
 */

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some((path) => pathname.startsWith(path));
}

/**
 * Helper function untuk membuat URL redirect
 */

function createRedirectUrl(
  path: string,
  baseUrl: string,
  callbackUrl?: string
): URL {
  const url = new URL(path, baseUrl);
  if (callbackUrl) {
    url.searchParams.set("callbackUrl", callbackUrl);
  }
  return url;
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api/")) {
      if (!isValidRequest(request)) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "Direct API access is not allowed",
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (pathname.startsWith("/api/auth/")) {
        return NextResponse.next();
      }

      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "Authentication required",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!["admin", "user"].includes(token.role as string)) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "Unauthorized access",
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (matchesPath(pathname, authConfig.authPaths) && token) {
      if (token.role === "admin") {
        return NextResponse.redirect(
          new URL(authConfig.adminDashboard, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(authConfig.userDashboard, request.url)
      );
    }

    if (
      matchesPath(pathname, [
        ...authConfig.publicPaths,
        ...authConfig.authPaths,
      ])
    ) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(
        createRedirectUrl(authConfig.loginPath, request.url, pathname)
      );
    }

    const userRole = token.role as UserRole;

    if (matchesPath(pathname, authConfig.adminPaths)) {
      if (userRole !== "admin") {
        return NextResponse.redirect(
          createRedirectUrl(authConfig.unauthorizedPath, request.url)
        );
      }
    }

    if (matchesPath(pathname, authConfig.userPaths)) {
      if (!["user", "admin"].includes(userRole)) {
        return NextResponse.redirect(
          createRedirectUrl(authConfig.unauthorizedPath, request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(
      createRedirectUrl(authConfig.loginPath, request.url)
    );
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
