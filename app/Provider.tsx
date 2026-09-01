'use client'
import React, { useState } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';


import { CollectionsProvider } from '@/Contexts/Collections.context';

function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 10, // 10 minutes cache
                refetchOnWindowFocus: false,
            },
        },
    }));
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY || ""}>
            <QueryClientProvider client={queryClient}>
                <CollectionsProvider>
                    {children}
                </CollectionsProvider>
            </QueryClientProvider>
        </GoogleReCaptchaProvider>
    )
}

export default Provider
