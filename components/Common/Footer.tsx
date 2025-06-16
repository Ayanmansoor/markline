'use client'
import React from 'react'
import { CiInstagram } from "react-icons/ci";
import { CiFacebook } from "react-icons/ci";
import { RxTwitterLogo } from "react-icons/rx";
import { RiTelegramLine } from "react-icons/ri";
import { PiFacebookLogo } from "react-icons/pi";
import { PiInstagramLogoThin } from "react-icons/pi";
import { RiTwitterXLine } from "react-icons/ri";
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const subscribeSchema = z.object({
  email: z.string().email()
})

type subscribeSchemaInterface = z.infer<typeof subscribeSchema>;

function Footer() {

  const { executeRecaptcha } = useGoogleReCaptcha()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(subscribeSchema)
  })

  async function onSubmit({ email }: subscribeSchemaInterface) {
    if (!executeRecaptcha) {
      return null;
    }
    const token = executeRecaptcha()
    const reponse = await axios.post("/api/subcribe", {
      email: email,
      token: token
    })

  }

  return (
    <footer className='  w-full relative lg:py-10 lg:h-[500px] text-primary-foreground  md:bg-black   overflow-hidden'>


      <section className='w-full h-auto flex flex-col gap-2'>
        <span className='w-full relative h-auto flex flex-col gap-2'>
          <h2 className='text-lg font-medium text-primary'></h2>
        </span>

      </section>

      <section className='w-full relative h-[450px] md:flex hidden  flex-col gap-1 container text-white py-10 pb-56 px-5 md:px-10   xl:px-20'>
        <div className=' w-full h-full grid   z-20 grid-cols-4 gap-5  '>

          <div className='relative h-auto  '>
            <h2 className='text-p20 font-medium mb-4 border-b pr-5  w-fit '>
              Pages
            </h2>
            <ul className='flex items-start flex-col text-base justify-start gap-2'>
              <Link href={'/new-arrivals'} >New Arrived</Link>
              <Link href={'/products'} >Proudcts</Link>
              <Link href={'/trending'} >Trending</Link>
              <Link href={'/about-us'} >About us</Link>
              <Link href={'/blogs'} >Blogs</Link>
              <Link href={'/contact-us'} >Contact Us</Link>
              <Link href={'/contact-us'} >Feedback</Link>

              {/* <Link href={'/privacy-policy'} >Privacy and Policy</Link>
              <Link href={'/shiping-policy'} >Shiping Policy</Link>
              <Link href={'/return-policy'} >Return Policy</Link> */}
              <Link href={'/about-us'} >FAQ</Link>

            </ul>
          </div>


          <div className='relative h-auto  '>
            <h2 className='text-p20 font-medium mb-4 border-b w-fit pr-5 '>

              Collections

            </h2>
            <ul className='flex items-start flex-col  text-base justify-start gap-2'>
              <Link href={'/gender/men'} >Men</Link>
              <Link href={'/gender/women'} >Women</Link>
              <Link href={'/gender/kids'} >Kids</Link>
              <Link href={'/gender/trending'} >Gen Z</Link>
              {/* <Link href={'/discount-deals'} >Discount Deals</Link> */}
            </ul>
          </div>


          <div className='relative h-auto  justify-self-start '>
            <h2 className='text-p20 font-medium mb-4 border-b w-fit pr-5'>
              Follow Us

            </h2>
            <ul className='flex items-start flex-col text-base  justify-start gap-3'>
              <Link href={"https://www.instagram.com/marklinefashion/"} target='_blank' rel='noreferrer noindex' className='flex items-center gap-1'><CiInstagram className='text-[20px] hover:text-red-300' /> Instagram</Link>
              <Link href={""} rel='noreferrer noindex' target='_blank' className='flex items-center gap-1'><CiFacebook className='text-[20px] hover:text-red-300' /> Facebook</Link>
              <Link href={"https://x.com/MarklineFashion"} rel='noreferrer noindex' target='_blank' className='flex items-center gap-1'><RxTwitterLogo className='text-[20px] hover:text-red-300' /> Twitter</Link>
            </ul>
          </div>


          <div className='relative h-auto  justify-self-start '>
            <h2 className='text-p20 font-medium mb-4 border-b w-fit pr-5'>
              Subscrib Us
            </h2>
            <form action='' onSubmit={handleSubmit(onSubmit)} className='flex items-start flex-col text-p18  justify-start gap-3'>
              <input type="text" className='w-full relative h-atuo py-2 cursor-pointer px-2 border-b border-white bg-transparent placeholder:text-white placeholder:text-sm text-base' placeholder='Enter Your Email' {...register('email')} />
            </form>

          </div>

        </div>
      </section>

      <section className='w-full relative h-auto flex items-center justify-center gap-5 py-2 bottom-10 z-20 '>
        <Link href={'/privacy-policy'} className=' text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Privacy & Policy</Link>
        <Link href={'/terms-condition'} className='text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Terms & Conditions</Link>
        <Link href={'/shipping-policy'} className='text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Shipping & Return</Link>
        <Link href={'/claim-policy'} className='text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Product Claim Policy </Link>
      </section>

      <div className='w-full relative bottom-5 z-0  z- h-auto  hidden  md:flex leading-[1.1] items-center  opacity-10  uppercase font-semibold text-footerfont justify-center -mt-28 text-gray-100 bg-clip-text left-0 right-0 '>
        markline fashion
      </div>



      <div className='container px-5   mx-auto h-auto relative  md:px-10  py-10 bg-secondary block sm:hidden   xl:px-20 '>
        <Accordion type="single" collapsible className=' text-third hover:no-underline'>
          <AccordionItem value="item-1" className="hover:no-underline">
            <AccordionTrigger className='hover:no-underline  text-primary'>Pages</AccordionTrigger>
            <AccordionContent >
              <div className='relative h-auto  '>

                <hr className='mt-1  text-primary' />

                <ul className='flex items-start mt-2 flex-col text-base justify-start gap-2 text-primary'>
                  <Link href={'/'} className='text-primary'  >Home</Link>
                  <Link href={'/new-arrivals'} className='text-primary'  >New Arrived</Link>
                  <Link href={'/products'} className='text-primary'  >Proudcts</Link>
                  <Link href={'/tranding'} className='text-primary' >Trnding</Link>
                  <Link href={'/about-us'} className='text-primary' >About us</Link>
                  <Link href={'/privacy-policy'} className=' text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Privacy & Policy</Link>
                  <Link href={'/terms-condition'} className='text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Terms & Conditions</Link>
                  <Link href={'/shipping-policy'} className='text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Shipping & Return</Link>
                  <Link href={'/claim-policy'} className='text-xs lg:text-sm font-meidum text-white cursor-pointer underline'>Product Claim Policy </Link>
                  <Link href={'/about-us'} className='text-primary' >FAQ</Link>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>




        <Accordion type="single" collapsible className=' text-third hover:no-underline'>
          <AccordionItem value="item-1">
            <AccordionTrigger className=' hover:no-underline  text-primary'>Collection For</AccordionTrigger>
            <AccordionContent >
              <div className='relative h-auto  '>
                <hr className='mt-1' />

                <ul className='flex items-start flex-col mt-2  text-base justify-start gap-2  text-primary'>
                  <Link href="/gender/MEN" className='text-primary' >Man</Link>
                  <Link href="/gender/WOMEN" className='text-primary' >Women</Link>
                  <Link href='/gender/KIDS' className='text-primary' >kids</Link>
                  {/* <Link href="/gender/trending" className='text-primary' >Trending</Link> */}

                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className='w-full h-auto relative bg-secondary block  sm:hidden pt-5 pb-10 sm:pb-0 '>
        <p className='text-p20 font-light text-third text-center text-primary '>Follow Us</p>
        <hr className='w-full absolute top-8 text-primary ' />
        <div className=' container mx-auto h-auto px-20 py-3 flex justify-center items-center gap-5'>
          <PiFacebookLogo className='text-[35px] rounded-2xl text-primary p-1 bg-third' />
          <PiInstagramLogoThin className='text-[35px] rounded-2xl text-primary p-1 bg-third' />
          <RiTwitterXLine className='text-[35px] rounded-2xl text-primary p-1 bg-third' />
        </div>
      </div>



    </footer>
  )
}

export default Footer