import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );

  // Get a real user ID to bypass FK error
  const { data: users, error: userError } = await adminSupabase.auth.admin.listUsers();
  
  if (userError || !users?.users?.length) {
     return NextResponse.json({ error: 'Could not fetch a real user for testing.' });
  }

  const realUserId = users.users[0].id;

  const dummyItem = {
    user_id: realUserId,
    product_id: 1, // Must be a real product ID ideally
    product_name: 'Test Product',
    slug: 'test-product',
    gender: 'WOMEN',
    variant_id: 1, // Must be a real variant ID ideally
    variant_sku: 'TEST-SKU',
    variant_price: 999,
    selected_color_name: 'Red',
    selected_color_hex: '#FF0000',
    selected_size: '38',
    selected_size_unit: 'EU',
    quantity: 1,
    image_url: 'http://example.com/test.jpg',
  };

  const { data, error } = await adminSupabase
    .from('cart')
    .upsert(dummyItem, {
      onConflict: 'user_id,variant_id,selected_color_name,selected_size',
    })
    .select();

  return NextResponse.json({
    data,
    error: error ? { message: error.message, details: error.details, hint: error.hint, code: error.code } : null
  });
}
