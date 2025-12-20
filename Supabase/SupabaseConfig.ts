import { createClient } from "@supabase/supabase-js";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key: string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const supabaseUrl: string = url;
const supabaseKey: string = key;
const mysupabase = createClient(supabaseUrl, supabaseKey);

export { mysupabase };
