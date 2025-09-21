// This file provides type declarations for Deno-specific globals and URL imports
// to prevent TypeScript errors in a Node.js/Next.js environment.

declare namespace Deno {
  export const env: {
    get(key: string): string | undefined;
  };
}

declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response> | Response): Promise<void>;
}

declare module "https://esm.sh/@supabase/supabase-js@2.45.0?dts" {
  import { SupabaseClient } from '@supabase/supabase-js';
  export function createClient(supabaseUrl: string, supabaseKey: string): SupabaseClient;
  export type SupabaseClient = import('@supabase/supabase-js').SupabaseClient;
  export type AuthChangeEvent = import('@supabase/supabase-js').AuthChangeEvent;
  export type Session = import('@supabase/supabase-js').Session;
  export type User = import('@supabase/supabase-js').User;
  export type RealtimePostgresChangesPayload<T> = import('@supabase/supabase-js').RealtimePostgresChangesPayload<T>;
}