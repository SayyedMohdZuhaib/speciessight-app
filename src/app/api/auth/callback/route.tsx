// src/app/auth/callback/route.tsx
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase'; // Adjust path if needed

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      const supabase = createRouteHandlerClient<Database>({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
      console.log('Callback: Successfully exchanged code for session.'); // Optional: Add logging
    } catch (error) {
      console.error('Callback: Error exchanging code for session:', error);
      // Consider redirecting to an error page or login with an error indicator
    }
  } else {
      console.log('Callback: No code found in URL.'); // Optional: Add logging
  }

  // Explicitly redirect to the homepage ('/') relative to the origin
  // This ensures you land on the page corresponding to src/app/page.tsx
  const redirectUrl = requestUrl.origin + '/';
  console.log('Callback: Redirecting to:', redirectUrl); // Optional: Add logging
  return NextResponse.redirect(redirectUrl);
}