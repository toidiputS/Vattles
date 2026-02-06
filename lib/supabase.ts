
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely with fallback for browser environments
// In Vite: import.meta.env.VITE_xxx
// In Node/Webpack: process.env.VITE_xxx
// Fallback: Hardcoded values for this specific preview instance

const getEnv = (key: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://dhtpzhnrdjfybugggapp.supabase.co');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_7h2vhGBfb_t5gwI3lzdGeA_51YtlQva');

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Authentication features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
