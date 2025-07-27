'use client'
import React, { useState } from 'react'


import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'


const claimRequestFromschema=z.object({
    name:z.string(),
    email:z.string().email(),
    orderID:z.string(),
    productname:z.string(),
    discription:z.string(),
    
})

type claimRequestschema=z.infer<typeof claimRequestFromschema>

function ClaimRequestFrom() {
  const [submitting,setSubmitting]=useState(false)
  const {executeRecaptcha}=useGoogleReCaptcha()

    const {register,handleSubmit,reset,formState:{errors},watch}= useForm(
            {
                resolver: zodResolver(claimRequestFromschema)
            }
        )


    async function onSubmit(data:claimRequestschema) {
      if(!executeRecaptcha)  {
        return;
      }
      
      try{
          const token=await executeRecaptcha()
          setSubmitting(true)
          const response=await axios.post('/api/claimproduct',{
              token,
              ...data
            })
            setSubmitting(false)
        }
        catch(error){
          console.log("error while claim products")
        }
    }
    

  return (
     <div className=" w-full h-fit px-4 py-10  border sticky top-20">
      <h2 className="text-2xl font-bold mb-6">Submit a Product Claim</h2>
      <form  className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input
            type="text"
            {...register("name")}
            required
            className="w-full border rounded-md px-3 py-2"
          />
         {errors?.name &&
                        <p className='text-xs font-medium text-red-400'>{errors.name?.message}</p>}
          <p ></p>
        </div>

        <div>
          <label className="block font-medium mb-1">Email *</label>
          <input
            type="email"
             {...register("email")}
            required
            className="w-full border rounded-md px-3 py-2"
          />

                   {errors?.email &&
                        <p className='text-xs font-medium text-red-400'>{errors.email?.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Order ID *</label>
          <input
            type="text"
            {...register("orderID")}
            
            required
            className="w-full border rounded-md px-3 py-2"
          />
            {errors?.orderID &&
                        <p className='text-xs font-medium text-red-400'>{errors.orderID?.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            {...register("productname")}
            
            className="w-full border rounded-md px-3 py-2"
          />
            {errors?.productname &&
                        <p className='text-xs font-medium text-red-400'>{errors.productname?.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Issue Description *</label>
          <textarea
            {...register("discription")}
            rows={5}
            required
            className="w-full border rounded-md px-3 py-2"
          ></textarea>
            {errors?.discription &&
                        <p className='text-xs font-medium text-red-400'>{errors.discription?.message}</p>}
        </div>
{/* 
        <div>
          <label className="block font-medium mb-1">Upload Photo/Video</label>
          <input
            type="file"
            accept="image/*,video/*"
        
            className="w-full"
          />
        </div> */}

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          {
            submitting ? "Submitting..." :"Submit Claim"
          }
        </button>

      </form>
    </div>
  )
}

export default ClaimRequestFrom