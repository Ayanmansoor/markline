import React from 'react'
import SearchPage from '@/components/Pages/SearchPage';
import { getsearchProducts } from '@/Supabase/SupabaseApi';
async function page({ searchParams }) {
    const query = (await searchParams)?.q || "";
    
    // Fetch initial results server-side if query exists
    const initialResults = query ? await getsearchProducts(query) : [];

    return (
        <>
            <SearchPage initialResults={initialResults} />
        </>
    )
}

export default page

