import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;
  if (pathname.startsWith(`/api/`) && !pathname.startsWith("/api/socket/")) {
    //|| pathname.startsWith(`/api/login/`)
    if (
      !req.headers.get("referer")?.includes("localhost:3000") &&
      (req.headers.get("user-agent") != "undici" ||
        req.headers.get("host") != "localhost:3000")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!fonts|svg|[\\w-]+\\.\\w+).*)"],
};
