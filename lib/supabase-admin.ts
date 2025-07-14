import { createClient } from '@supabase/supabase-js';

// Ensure that the environment variables are not undefined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      // It's important to set autoRefreshToken to false on the server-side
      // to prevent issues with session refreshing.
      autoRefreshToken: false,
      persistSession: false,
    },
  }
); 