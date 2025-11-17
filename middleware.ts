import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"

const PUBLIC_ROUTES = ["/", "/signin", "/signup", "/about", "/accueil", "/conversations"]

const PUBLIC_FILE = /\.(.*)$/

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow Next.js internals, auth API routes, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Get session
  const session = await auth()

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/"
    }
    // Allow public routes and their sub-routes (like /conversations/[id])
    // But exclude protected sub-routes like /conversations/new
    if (route === "/conversations") {
      // Allow viewing conversations but not creating new ones
      if (pathname === "/conversations/new") {
        return false
      }
      return pathname === route || pathname.startsWith(`${route}/`)
    }
    return pathname === route || pathname.startsWith(`${route}/`)
  })

  const isAuthenticated = !!session?.user

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && !isPublicRoute) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const signInUrl = new URL("/signin", request.url)
    const callbackPath = request.nextUrl.pathname + request.nextUrl.search
    signInUrl.searchParams.set("callbackUrl", callbackPath)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from signin/signup pages
  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/account", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}