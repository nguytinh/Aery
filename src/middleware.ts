import { auth } from "@/auth"
 
const valid_paths = ["/", "/login", "/signup", "/api/user/signup", "/api/user/signin", '/api/user/signout', '/api/user/test', '/profile/create']

export default auth((req) => {
  // if user is not authenticated, then redirect to login page
  if (!req.auth && !valid_paths.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }})
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}