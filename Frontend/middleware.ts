import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/profile", "/checkout", "/orders", "/admin"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (PROTECTED.some((p) => url.pathname.startsWith(p))) {
    const authCookie = req.cookies.get("auth");
    const isLoggedIn = !!authCookie;
    if (!isLoggedIn) {
      url.pathname = "/login";
      url.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
