'use client'
import React from 'react'
import BlogCard from '../Blogs/BlogCard'
import axios from 'axios'
import { useQuery } from 'react-query'
import { getAllBlogs } from '@/Supabase/SupabaseApi'
import BlogBanner from '../Blogs/BlogBanner'
import { BlogCardProps } from '@/types/interfaces'


function BlogsPage() {
    const {
        data: blogs,
        isLoading: blogLoading,
        isError: isError,
    } = useQuery<any>({
        queryKey: ["blogs"],
        queryFn: getAllBlogs,
        staleTime: 1000 * 60 * 2,
        retry: 2,
    });


    return (
        <>
            <BlogBanner imageUrl={'/blogbanner.avif'} title={'Blogs'} />
            {
                blogLoading ?
                        <>
                        </>
                    :
                    <section className='w-full relative container px-2  md:px-10 py-10   xl:px-20   h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 '>
                        {
                            blogs?.map((item:BlogCardProps, index:number) => (
                                <BlogCard data={item} key={index} />
                            ))
                        }


                    </section>
            }

        </>
    )
}

export default BlogsPage