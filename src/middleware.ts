import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "JWT_SECRET";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  const isDashboardPath = path.startsWith("/dashboard");

  if (isDashboardPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: any = jwt.verify(token, SECRET_KEY);
      const userRole = decodedToken.role;

      // Define role-based access logic
      if (path.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(
          new URL("/login", request.nextUrl)
        );
      }

      if (
        path.startsWith("/staff") &&
        !["staff"].includes(userRole)
      ) {
        return NextResponse.redirect(
          new URL("/login", request.nextUrl)
        );
      }

      if (
        path.startsWith("/user") &&
        !(
          userRole === "user" 
         
        )
      ) {
        return NextResponse.redirect(
          new URL("/login", request.nextUrl)
        );
      }

      // Add more role-based access checks as needed...
    } catch (error) {
      console.log(error)
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/staff/:path*"],
};
