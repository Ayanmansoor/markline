import React from 'react'
import { GoArrowUpRight } from "react-icons/go";
import Link from 'next/link';
import { CategoriesSectionProps } from '@/types/interfaces';

function CategoriesSection({ children, title, url ,urltext ,subtitle ,isH1 }: CategoriesSectionProps) {
    return (
        <section className='w-full relative container h-auto items-start gap-5  py-10 lg:py-20  flex flex-col  '>
            <div className='w-full relative h-auto flex justify-between gap-2'>
                <span className='flex flex-col gap-3'>
                    {
                        isH1 ? 
                          <h1 className='  text-base md:text-h1 font-medium     uppercase   bg-secondary '>{title}</h1>                        
                        :
                          <h2 className='  text-base md:text-h1 font-medium     uppercase   bg-secondary '>{title}</h2>
                    }
                    {
                        subtitle &&
                        <h3 className='text-sm md:text-base font-medium italic text-primary '>{subtitle}</h3>
                    }

                </span>
                {
                    url &&
                    <Link href={`/${url}`} className=' text-sm md:text-lg  font-medium text-foreground flex items-center gap-1 capitalize' >{urltext} <GoArrowUpRight className='text-[20px] ' /> </Link>
                }
            </div>
            <section className='w-full relative h-auto  '>
                {children}
            </section>
        </section>
    )
}

export default CategoriesSection