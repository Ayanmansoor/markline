'use client'
import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

function Provider({children}:{children:React.ReactNode}) {
    const query=new QueryClient()
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY||""}>
        <QueryClientProvider client={query}>
            {children}
        </QueryClientProvider>
    </GoogleReCaptchaProvider>
  )
}

export default Provider