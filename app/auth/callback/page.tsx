"use client"
import { useEffect, useState } from "react"


import { useRouter } from "next/navigation"
import { mysupabase } from "@/Supabase/SupabaseConfig"
export default function AuthCallback() {

    const route = useRouter()
    useEffect(() => {
        const verefication = async () => {
            const { error } = await mysupabase.auth.getSession()
            if (!error) {
                route.push('/')
            }
            else {
                // route.push('/')
                console.log(error, 'this is console')
            }
        }
        verefication()
    }, [route])

    return (
        <>
            <h1>hello</h1>
        </>
    )

}