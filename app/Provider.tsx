'use client'
import React, { useState } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';


function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 10, // 5 minutes cache
                refetchOnWindowFocus: false,
            },
        },
    }));
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY || ""}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </GoogleReCaptchaProvider>
    )
}

export default Provider
