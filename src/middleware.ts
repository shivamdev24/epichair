import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // Log the path and token for debugging
  console.log("Path:", path);
  console.log("Token:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);
    const userRole = (decodedToken as any).role;

    // Log user role for debugging
    console.log("User Role:", userRole);

    // Role-based access checks
    if (path.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (path.startsWith("/staff") && userRole !== "staff") {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (path.startsWith("/user") && userRole !== "user") {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  } catch (error) {
    console.error("JWT verification error:", error);
    return 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/staff/:path*",
    "/service",
  ],
};
