// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hzsipqdxnxiwgkwqtykb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6c2lwcWR4bnhpd2drd3F0eWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MTk0NzUsImV4cCI6MjA1MzM5NTQ3NX0.DUUukqQiaOx79LOVkw0rqPSyyr-TrfL-Hzzy5VeJJHo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);