// src/lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase' // We'll create this type later

// If you haven't generated types from your Supabase schema yet, you can use a generic:
// export const createSupabaseServerClient = () => createServerComponentClient({ cookies })
// Or, for now, use 'any' if Database type isn't ready (not recommended for long term)
export const createSupabaseServerClient = () => createServerComponentClient<Database>({ cookies })