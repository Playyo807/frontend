import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const publicPaths = ["/login", "/api/auth"];

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );
  if (isPublic) return NextResponse.next();
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
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
