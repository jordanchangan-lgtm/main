import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client — SERVICE ROLE. Never import this into a client component.
// Use only inside /app/api routes for writes (orders, stock) that bypass RLS.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
