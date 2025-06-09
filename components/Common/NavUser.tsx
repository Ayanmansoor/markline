import React, { useEffect, useState } from 'react'
import { CiUser } from "react-icons/ci";
import LoginModal from './LoginModal';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import Link from 'next/link';
function NavUser() {
    const [isUser, setUser] = useState<any>()

    useEffect(() => {
        async function one() {
            const { data: { user } } = await mysupabase.auth.getUser()
            setUser(user)
        }
        one()
    }, [])






    return (
        <div className='flex items-center justify-start gap-1 cursor-pointer '>
            {
                isUser ?
                    <Link href={'/user'}>
                        <CiUser className='text-[30px] cursor-pointer' />
                    </Link>
                    :
                    <LoginModal>
                        <CiUser className='text-[30px] cursor-pointer' />
                    </LoginModal>
            }
        </div>
    )
}

export default NavUser