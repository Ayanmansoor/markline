import React from 'react'
import { GoArrowUpRight } from "react-icons/go";
import Link from 'next/link';
import { CategoriesSectionProps } from '@/types/interfaces';

function CategoriesSection({ children, title, url, urltext, subtitle, isH1 }: CategoriesSectionProps) {
    return (
        <section className='w-full relative  h-auto items-start gap-5  py-10 lg:py-20  flex flex-col  px-3 md:px-5 lg:px-10    '>
            <div className='w-full relative h-auto flex items-start justify-between gap-2'>
                <span className='flex flex-col gap-1 '>
                    {
                        isH1 ?
                            <h1 className='    text-lg md:text-2xl xl:text-3xl self-start  font-medium   w-fit  uppercase   '>{title}</h1>
                            :
                            <h2 className='     text-lg md:text-2xl xl:text-3xl  font-medium     uppercase self-start   w-fit  '>{title}</h2>
                    }
                    {
                        subtitle &&
                        <h3 className=' text-xs md:text-sm lg:text-base self-start font-medium w-fit italic text-primary '>{subtitle}</h3>
                    }

                </span>
                {
                    url &&
                    <Link href={`/${url}`} className=' text-sm xl:text-lg w-fit self-end  font-medium text-foreground flex items-center gap-1 capitalize' >{urltext} <GoArrowUpRight className='text-[20px] ' /> </Link>
                }
            </div>
            <section className='w-full relative h-auto  '>
                {children}
            </section>
        </section>
    )
}

export default CategoriesSection