// import { NextRequest, NextResponse } from "next/server"
// import { auth } from "@/lib/auth/auth"

// const PUBLIC_ROUTES = ["/", "/signin", "/signup", "/about", "/accueil"]

// const PUBLIC_FILE = /\.(.*)$/

// export default auth((request : NextRequest) => {
//   const { pathname } = request.nextUrl

//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api/auth") ||
//     PUBLIC_FILE.test(pathname)
//   ) {
//     return NextResponse.next()
//   }

//   const isPublicRoute = PUBLIC_ROUTES.some((route) => {
//     if (route === "/") {
//       return pathname === "/"
//     }

//     return pathname === route || pathname.startsWith(`${route}/`)
//   })
//   const isAuthenticated = !!request.auth?.user

//   if (!isAuthenticated && !isPublicRoute) {
//     if (pathname.startsWith("/api")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const signInUrl = new URL("/signin", request.url)
//     const callbackPath = request.nextUrl.pathname + request.nextUrl.search
//     signInUrl.searchParams.set("callbackUrl", callbackPath)
//     return NextResponse.redirect(signInUrl)
//   }

//   if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
//     return NextResponse.redirect(new URL("/account", request.url))
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
//   ],
// }