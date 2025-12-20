'use client'
import React from 'react'
import BlogBanner from '../Blogs/BlogBanner'
import { getblog } from '@/Supabase/SupabaseApi'
import { useQuery } from 'react-query'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'



function BlogPage() {
    const { slug } = useParams()
    const blogslug : any = Array.isArray(slug) ? slug[0] : slug;
    const route=useRouter()

    const {
        data: blog,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => getblog(blogslug),
        enabled: !!slug,
        staleTime: Infinity,        
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false, 
    });

    if(isError){
        route.push("404")
    }


    return (
        <>
            <BlogBanner imageUrl={blog?.bannerImage} title={blog?.title}  />
            <section className='w-full py-5 md:py-10 relative h-auto flex flex-col gap-3 container px-5 md:px-20 lg:px-40'>
                <h2 className=' text-p35 md:text-p40 font-semibold text-primary'>
                    {blog?.title}
                </h2>
                <img src={blog?.image || ""} alt={blog?.title} height={400} width={500} className=' max-h-[250px] md:max-h-[300px] lg:max-h-[500px]  h-auto w-full object-cover reative ' loading='lazy' />
            </section>
            <div className='w-full relative h-auto container px-5 md:px-20 lg:px-40 pb-20' dangerouslySetInnerHTML={{
                __html: blog?.content
            }} />
        </>
    )
}

export default BlogPage