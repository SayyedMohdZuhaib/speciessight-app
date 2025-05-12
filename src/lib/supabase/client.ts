// src/lib/supabase/client.ts
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase' // We'll create this type later

// If you haven't generated types from your Supabase schema yet, you can use a generic:
// export const supabaseBrowserClient = createPagesBrowserClient()
// Or, for now, use 'any' if Database type isn't ready (not recommended for long term)
export const supabaseBrowserClient = createPagesBrowserClient<Database>()