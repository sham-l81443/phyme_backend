import { createClient } from '@supabase/supabase-js';


const initializeSupabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  const supabase = createClient(
    process.env.SUPABASE_URL,
  
    process.env.SUPABASE_SERVICE_ROLE_KEY
  
  );
  return supabase
}




export default initializeSupabase;
