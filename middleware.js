import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const userId = auth().userId;
  const orgId = auth().orgId;
  console.log("[Middleware] userId:", userId);
  console.log("[Middleware] orgId:", orgId);
  console.log("[Middleware] pathname:", req.nextUrl.pathname);

  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }

  if (
    auth().userId &&
    !auth().orgId &&
    !req.nextUrl.pathname.startsWith("/organization/") &&
    req.nextUrl.pathname !== "/onboarding" &&
    req.nextUrl.pathname !== "/" 
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
