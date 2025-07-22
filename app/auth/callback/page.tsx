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
           <div className="w-full relative h-[50vh] flex items-center justify-center ">

                    <p className="text-2lx font-medium text-base text-primary">
                        just a second ....
                    </p>

           </div>
        </>
    )

}