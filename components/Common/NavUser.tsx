import React, { useEffect, useState } from 'react'
import { CiUser } from "react-icons/ci";
import LoginModal from './LoginModal';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import Link from 'next/link';
import { PiUserCircleThin } from "react-icons/pi";
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
                        <PiUserCircleThin className=' text-[25px] xl:text-[35px]  cursor-pointer' />
                    </Link>
                    :
                    <LoginModal>
                        <PiUserCircleThin className='text-[25px] xl:text-[35px] cursor-pointer ' />
                    </LoginModal>
            }
        </div>
    )
}

export default NavUser