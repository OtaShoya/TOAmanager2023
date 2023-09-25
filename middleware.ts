import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const { pathname } = url
  if (pathname.startsWith(`/api/test/`)) {
    if (!req.headers.get("referer")?.includes(process.env.APP_URL as string) && ( req.headers.get("user-agent") != "undici" || req.headers.get("host")  != process.env.APP_HOST)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!fonts|svg|[\\w-]+\\.\\w+).*)'],
}