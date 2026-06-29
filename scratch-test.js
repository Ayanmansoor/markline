import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'; // Make sure to install dotenv if needed, or we just read from env

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

async function checkSchema() {
  // We can't query the table directly without a session if RLS is on and strictly checking auth.uid()
  // But we can check if we get a 401/RLS error vs a 404 (table not found) or a schema error
  
  console.log("Checking Cart Table...");
  
  const { data, error } = await supabase
    .from('cart')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Cart Error:", error.message);
  } else {
    console.log("Cart Data:", data);
  }
}

checkSchema();
