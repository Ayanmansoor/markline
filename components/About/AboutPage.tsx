'use client'
import React from 'react'
import { useQuery } from 'react-query';
import { getAllProducts } from '@/Supabase/SupabaseApi';
import CategoriesSection from '../Common/CategoriesSection';
import CarouselProduct from '../Product/CarouselProduct';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


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
    qa: "Do you ship internationally?",
    ans: "Yes, we offer worldwide shipping. Shipping costs and delivery times may vary depending on your location."
  },
  {
    qa: "What is your return policy?",
    ans: "We accept returns within 14 days of delivery for unused and undamaged products in their original packaging."
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
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 2, // Keep fresh for 2 minutes
    retry: 2,
  });


  return (
    <>
      <section className='w-full flex flex-col items-start gap-4 container py-10 lg:py-20 px-3 md:px-10 lg:px-20'>

        <h1 className=' text-2xl md:text-3xl lg:text-5xl text-center w-full h-auto py-3 font-medium text-primary uppercase'>Markline Fashion</h1>
        <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-lg'>About Markline </strong>
          Markline is where style meets comfort — every step of the way. Born with a vision to deliver high-quality, stylish, and affordable footwear for everyone, we’re here to make fashion accessible without compromising on comfort.
        </p>
        <p className='w-full relative  text-sm sm:text-base md:text-lg  h-auto  font-medium text-gray-600'>
          From everyday essentials to festive favourites, our collections for men, women, and kids are designed to fit every moment of your life. Whether you’re heading to work, walking into a party, or stepping out for a casual day, Markline ensures you always walk with confidence and ease.
        </p>


      </section>
      <section className='w-full relative h-auto flex-col  flex items-start gap-2 '>
        <video width="320" className='w-full relative min-h-[250px] max-h-fit pb-10 ' height="240" autoPlay muted loop>
          <source src="about-video.mp4" type="video/mp4"  className='w-full relative object-cover'/>
        </video>
        <p className='w-full relative  text-base md:text-lg container px-3 md:px-10 lg:px-20 h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-sm sm:text-base md:text-lg'>History of Markline </strong>
          Markline Fashion was founded in 1998 in Mumbai with a vision to redefine everyday footwear. What began as a small, passionate venture by our founder has now evolved into a beloved name in the Indian footwear industry.
        </p>
        <p className='w-full relative  text-base md:text-lg container px-3 md:px-10 lg:px-20 h-auto py-2 font-medium text-gray-600'>Driven by a commitment to quality, style, and comfort, Markline steadily grew from local recognition to nationwide reach. Over the years, we’ve stayed rooted in our values while stepping forward with innovation — creating shoes that resonate with both trendsetters and traditionalists.</p>

      </section>

      {
        allproducts?.length > 0 && (

          <CategoriesSection title={"Our Products "}  url="">

            <CarouselProduct  product={allproducts?.slice(0, 10)} url={'products'} />

          </CategoriesSection >
        )
      }

      <section className='w-full flex flex-col items-start gap-4 container py-10 lg:pt-20  px-3 md:px-10 lg:px-20'>
        <p className='w-full relative text-sm md:text-base  lg:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-lg'>Our Vision </strong>
          To become a global leader in luxury and affordable fashion footwear — where elegance, innovation, and comfort walk hand in hand. We envision a world where every step taken in a pair of Markline shoes is a step with confidence and style.
        </p>
      </section>
      <section className='w-full flex flex-col items-start gap-4 container pb-10 px-3 md:px-10 lg:px-20'>
        <p className='w-full relative  text-sm md:text-base  lg:text-lg  h-auto py-2 font-medium text-gray-600'>
          <strong className='text-primary text-base md:text-lg'>Our Mission </strong>
          At Markline , our mission is to craft high-quality, stylish, and comfortable footwear that empowers individuals to express their identity. We are committed to delivering timeless designs, embracing sustainability, and staying rooted in the evolving needs of our customers.
        </p>
      </section>


      <section className='w-full flex flex-col items-start gap-4 container pb-5 lg:pb-10   px-3 md:px-10 lg:px-20'>

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