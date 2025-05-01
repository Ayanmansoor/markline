import React from 'react'

interface BlogBannerprops{
    imageUrl:string,
    title:string,
}

function BlogBanner({imageUrl,title}:BlogBannerprops) {
  return (
    <section className='w-full relative  h-auto min-h-[200px] flex items-center justify-center  lg:h-[400px] bg-primary'>
        <img src={imageUrl} alt={title} className='w-full relative h-full min-h-[200px] object-cover' />
        <h1 className=' text-3xl md:text-5xl font-medium text-white absolute  '>{title}</h1>
    </section>

  )
}

export default BlogBanner