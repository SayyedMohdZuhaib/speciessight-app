// src/lib/supabase/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/supabase' // We'll create this type later

// If you haven't generated types from your Supabase schema yet, you can use a generic:
// export const createSupabaseMiddlewareClient = (req: NextRequest, res: NextResponse) => createMiddlewareClient({ req, res })
// Or, for now, use 'any' if Database type isn't ready (not recommended for long term)
export const createSupabaseMiddlewareClient = (req: NextRequest, res: NextResponse) => createMiddlewareClient<Database>({ req, res })