import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  const isDashboardPath = path.startsWith("/admin");

  if (isDashboardPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", request.nextUrl));
    }

    try {
      const decodedToken: any = jwt.verify(token, SECRET_KEY);
      const userRole = decodedToken.role;
      const userPermissions = decodedToken.permissions || []; // Optional: Include permissions if using them

      // Define role-based access logic
      if (path.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(
          new URL("/auth/forbidden", request.nextUrl)
        );
      }

      if (
        path.startsWith("/staff") &&
        !["admin", "staff"].includes(userRole)
      ) {
        return NextResponse.redirect(
          new URL("/auth/forbidden", request.nextUrl)
        );
      }

      if (
        path.startsWith("/dashboard/drafts") &&
        !(
          userRole === "admin" ||
          userRole === "staff" ||
          userPermissions.includes("view_drafts")
        )
      ) {
        return NextResponse.redirect(
          new URL("/auth/forbidden", request.nextUrl)
        );
      }

      // Add more role-based access checks as needed...
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/staff/:path*"],
};
