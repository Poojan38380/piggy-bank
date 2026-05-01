import { auth } from "@/lib/auth";

/**
 * Next.js 16 Proxy (formerly Middleware)
 * Handles route protection and auth redirects.
 */
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = 
    nextUrl.pathname.startsWith("/dashboard") || 
    nextUrl.pathname.startsWith("/analytics");
  
  const isAuthRoute = nextUrl.pathname === "/login";

  // 1. If on a protected route and not logged in, go to login
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // 2. If on the login page and ALREADY logged in, go to dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
