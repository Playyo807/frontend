import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const publicPaths = ["/login", "/api/auth"];

  // ✅ SAFE public path check: exact match OR path + slash
  const isPublic = publicPaths.some((path) => {
    const cleanPath = path.replace(/\/$/, "");
    return pathname === cleanPath || pathname.startsWith(`${cleanPath}/`);
  });

  if (isPublic) return NextResponse.next();

  const user = await prisma.user.findUnique({
    where: { email: req.auth?.user?.email ?? "" },
  });

  // ✅ CRITICAL: Redirect UNAUTHENTICATED users from ANY /client route
  if (!req.auth?.user || !user) {
    // Use origin (NOT req.url) to avoid malformed redirects
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname); // Preserve destination
    return NextResponse.redirect(loginUrl);
  }

  //@ts-expect-error
  if (!req.auth?.user?.phone && pathname !== "/client/dashboard") {
    return NextResponse.redirect(new URL("/client/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};
