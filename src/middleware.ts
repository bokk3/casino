import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Check for session cookie
  const token = request.cookies.get("casino_session")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");

  // Verify token if it exists
  let isValidSession = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.AUTH_SECRET || "casino-secret-key-change-in-production"
      );
      await jwtVerify(token, secret);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (isAuthPage && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to login if not logged in and trying to access protected pages
  if (!isValidSession && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
