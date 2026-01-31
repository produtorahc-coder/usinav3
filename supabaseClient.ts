import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "Supabase credentials missing! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file."
    );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);

