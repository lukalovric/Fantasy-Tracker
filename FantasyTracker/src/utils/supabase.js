import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oruoeoreylcglghihevm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydW9lb3JleWxjZ2xnaGloZXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwOTI4NTMsImV4cCI6MjA0MTY2ODg1M30.gfhcsUQ2i2pQwz6RHqKI1RxWrvonOgIWuFrJUtwXIZc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
