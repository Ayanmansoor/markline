import React from 'react'
import { GoArrowUpRight } from "react-icons/go";
import Link from 'next/link';
import { CategoriesSectionProps } from '@/types/interfaces';

function CategoriesSection({ children, title, url }: CategoriesSectionProps) {
    return (
        <section className='w-full relative container h-auto items-start gap-5  py-10 lg:py-20  flex flex-col px-2  md:px-10   xl:px-20 '>
            <div className='w-full relative h-auto flex justify-between gap-2'>
                <h2 className='  text-base md:text-h1 font-medium     uppercase   bg-secondary '>{title}</h2>
                {
                    url &&
                    <Link href={`/${url}`} className=' text-sm md:text-lg  font-medium text-foreground flex items-center gap-1 capitalize' >{url} <GoArrowUpRight className='text-[20px] ' /> </Link>
                }
            </div>
            <section className='w-full relative h-auto  '>
                {children}
            </section>
        </section>
    )
}

export default CategoriesSection