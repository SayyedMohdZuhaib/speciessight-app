// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware' // Ensure this path is correct

export async function middleware(req: NextRequest) {
  const res = NextResponse.next() // Create response object first
  const supabase = createSupabaseMiddlewareClient(req, res) // Pass req and res

  // Refresh session if expired - This will automatically refresh the session cookie
  // if it's expired or about to expire. This is crucial for keeping server components
  // and subsequent client components in sync after initial login.
  const { data: { session: refreshedSession } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl

  // Define public paths that don't require authentication
  const publicPaths = ['/api/auth', '/api/auth/callback'] // '/auth' is our login page

  // If user is not authenticated and trying to access a non-public path
  if (!refreshedSession && !publicPaths.some(path => pathname.startsWith(path))) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/api/auth'
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and tries to access the auth page, redirect to home
  if (refreshedSession && pathname.startsWith('/api/auth')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/api'
    return NextResponse.redirect(redirectUrl)
  }

  return res // Return the response object (which might have an updated session cookie)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
    '/',
  ],
}