'use client'
export const dynamic = 'force-dynamic';
import React from 'react'
import { useQuery } from 'react-query';
import {  getAllProductsWithVariants } from '@/Supabase/SupabaseApi';
import CategoriesSection from '../Common/CategoriesSection';
import CarouselProduct from '../Product/CarouselProduct';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { NewProductProps, ProductsProps } from '@/types/interfaces';
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton';


const faqData = [
  {
    qa: "What makes Markline shoes unique?",
    ans: "Markline combines luxury aesthetics with everyday comfort. Each pair is crafted with precision, premium materials, and a focus on timeless elegance."
  },
  {
    qa: "Where is Markline based?",
    ans: "Markline was founded in 1998 in Mumbai, India, and continues to design its collections with a blend of Indian heritage and global trends."
  },

  {
    qa: "What is your return policy?",
    ans: "We accept returns within 7 days of delivery for unused and undamaged products in their original packaging."
  },
  {
    qa: "How can I track my order?",
    ans: "Once your order is shipped, you'll receive a tracking number via email. You can also check your order status in your account section."
  },
  {
    qa: "Are Markline shoes sustainable?",
    ans: "We are continuously working to reduce our environmental footprint by sourcing eco-friendly materials and promoting ethical manufacturing."
  },
  {
    qa: "Do you offer custom designs or fittings?",
    ans: "Currently, we do not offer custom designs, but we are working on introducing more personalized options in the future."
  },
  {
    qa: "How do I choose the right size?",
    ans: "You can refer to our detailed size chart available on each product page to find your perfect fit."
  }
];



function AboutUsPage() {

  const {
    data: allproducts = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<any>({
    queryKey: ["about-product"],
    queryFn: getAllProductsWithVariants,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });


  return (
    <>
      <section className='w-full flex flex-col items-start gap-4  py-10 lg:py-20 px-3 md:px-10 '>

        <h1 className=' text-2xl md:text-3xl lg:text-5xl text-center w-full h-auto py-3 font-medium text-primary uppercase'>Markline</h1>
        
         <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-lg'>About Markline </strong>
          At Markline, we believe that every step you take should speak volumes — about your confidence, your style, and your story. Founded with a passion for blending timeless elegance with everyday comfort, Markline is more than a footwear brand — it&apos;s a statement of individuality and purpose.
        </p>
        <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
        We saw a world where people had to choose between premium quality and wearability. So we created Markline to bridge that gap — offering footwear that doesn&apos;t just follow fashion, but elevates it. From clean, urban silhouettes to refined finishes and breathable comfort, every pair is made to move with you.
        </p>
         <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
       Our collections are designed for the modern lifestyle — versatile enough for city streets, meetings, or weekend escapes. Whether you&apos;re stepping into new beginnings or embracing everyday hustle, Markline walks with you, offering the confidence to stand out and the comfort to keep going.

        </p>

         <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
        We are committed to responsible craftsmanship, thoughtful design, and a forward-thinking approach to fashion. Every pair is a reflection of our values: quality without compromise, design with soul, and comfort you can count on.
        </p>
        
         <p className='w-full relative flex flex-col gap-1  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
           At Markline, we don&apos;t just make shoes —
           <strong className='text-lg font-semibold text-primary'>we help you mark your way.</strong>
        </p>
        
        
        
        
        
        <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-lg'>Story Of  Markline  </strong>
          In a world of fast fashion and fleeting trends, Markline was born with a simple yet bold vision — to craft footwear that brings together timeless style, lasting comfort, and everyday versatility.
        </p>
        <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
         In a world of fast fashion and fleeting trends, Markline was born with a simple yet bold vision — to craft footwear that brings together timeless style, lasting comfort, and everyday versatility.
        </p>

        <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
       We design for the modern lifestyle — for people who move fast, think bold, and live with intention. Our shoes are made not just to complete a look, but to carry a story — whether it&apos;s walking into your first job, owning the street in your city, or finding confidence in your own skin.
        </p>

            <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
       With a focus on quality materials, conscious design, and a commitment to comfort, Markline shoes are built for the journey — not just the destination. We believe that style should be effortless, comfort should be non-negotiable, and every step you take should be a reflection of who you are.
        </p>

               <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
                 Markline is more than footwear. It&apos;s a movement of individuals who choose to walk their path with purpose.
                 <strong>Mark your way.</strong>
               </p>





      </section>
      <section className='w-full relative h-auto flex-col  flex items-start gap-2 '>
        <video width="320" className='w-full relative min-h-[250px] max-h-fit pb-10 ' height="240" autoPlay muted loop>
          <source src="about-video.mp4" type="video/mp4" className='w-full relative object-cover' />
        </video>
        <p className='w-full relative  text-base md:text-lg  px-3 md:px-10  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-sm sm:text-base md:text-lg'>History of Markline </strong>
          Markline was founded in 1998 in Mumbai with a vision to redefine everyday footwear. What began as a small, passionate venture by our founder has now evolved into a beloved name in the Indian footwear industry.
        </p>
        <p className='w-full relative  text-base md:text-lg  px-3 md:px-10  h-auto py-2 font-medium text-gray-600'>Driven by a commitment to quality, style, and comfort, Markline steadily grew from local recognition to nationwide reach. Over the years, we’ve stayed rooted in our values while stepping forward with innovation — creating shoes that resonate with both trendsetters and traditionalists.</p>

      </section>

      {
        allproducts?.length > 0 ?
        (
          <CategoriesSection title={"Our Products "} url="">
            <CarouselProduct product={allproducts} url={'product'} css=' sm:max-w-[500px]' />
          </CategoriesSection >
        )
        :
            <div className="grid grid-cols-2 py-10 lg:py-20 px-5 lg:px-10 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3   ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        
      }

       

      <section className='w-full flex flex-col items-start gap-4  py-10 lg:pt-20  px-3 md:px-10 '>
        <p className='w-full relative text-sm md:text-base  lg:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-lg'>Our Vision </strong>
         At Markline, our mission is to craft high-quality, stylish, and comfortable footwear that empowers individuals to express their identity. We are committed to delivering timeless designs, embracing sustainability, and staying rooted in the evolving needs of our customers.
        </p>
      </section>
      <section className='w-full flex flex-col items-start gap-4  pb-10 px-3 md:px-10 '>
        <p className='w-full relative  text-sm md:text-base  lg:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-base md:text-lg'>Our Mission </strong>
        At Markline, we craft premium, stylish, and comfortable footwear that empowers every individual to express themselves with confidence. We’re committed to timeless design, sustainable choices, and staying in tune with the ever-evolving lives of our customers.
        </p>
      </section>


      <section className='w-full flex flex-col items-start gap-4  pb-5 lg:pb-10   px-3 md:px-10 '>

        <h1 className='text-5xl text-center w-full h-auto py-3 font-medium text-primary uppercase'>FAQS</h1>
        <p className='w-full relative  text-sm md:text-base lg:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-base md:text-lg'>Markline  Faqs </strong>
          Got questions? We’ve got answers. Explore our most commonly asked questions to learn more about Markline’s craftsmanship, services, and customer experience.
        </p>

        <Accordion type="single" collapsible className='w-full relative h-auto '>
          {
            faqData.map((faq, index) => (
              <AccordionItem value={`item-${index}`} className="w-full relative" key={index}>
                <AccordionTrigger className=" text-sm md:text-lg px-5 font-medium relative text-primary border-b border-primary ">{faq.qa}</AccordionTrigger>
                <AccordionContent className="text-sm md:text-base font-medium py-5 px-5 relative text-gray-900">
                  {faq.ans}
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>

      </section>

    </>

  )
}



export default AboutUsPage