// 'use client'
// import React, { useState } from 'react'


// import { zodResolver } from '@hookform/resolvers/zod'
// import z from 'zod'
// import { useForm } from 'react-hook-form'
// import axios from 'axios'
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'


// const claimRequestFromschema=z.object({
//     name:z.string(),
//     email:z.string().email(),
//     orderID:z.string(),
//     productname:z.string(),
//     discription:z.string(),

// })

// type claimRequestschema=z.infer<typeof claimRequestFromschema>

// function ClaimRequestFrom() {
//   const [submitting,setSubmitting]=useState(false)
//   const {executeRecaptcha}=useGoogleReCaptcha()

//     const {register,handleSubmit,reset,formState:{errors},watch}= useForm(
//             {
//                 resolver: zodResolver(claimRequestFromschema)
//             }
//         )


//     async function onSubmit(data:claimRequestschema) {
//       if(!executeRecaptcha)  {
//         return;
//       }

//       try{
//           const token=await executeRecaptcha()
//           setSubmitting(true)
//           const response=await axios.post('/api/claimproduct',{
//               token,
//               ...data
//             })
//             setSubmitting(false)
//         }
//         catch(error){
//           console.log("error while claim products")
//         }
//     }


//   return (
//      <div className=" w-full h-fit px-4 py-10  border sticky top-20">
//       <h2 className="text-2xl font-bold mb-6">Submit a Product Claim</h2>
//       <form  className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label className="block font-medium mb-1">Name *</label>
//           <input
//             type="text"
//             {...register("name")}
//             required
//             className="w-full border rounded-md px-3 py-2"
//           />
//          {errors?.name &&
//                         <p className='text-xs font-medium text-red-400'>{errors.name?.message}</p>}
//           <p ></p>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Email *</label>
//           <input
//             type="email"
//              {...register("email")}
//             required
//             className="w-full border rounded-md px-3 py-2"
//           />

//                    {errors?.email &&
//                         <p className='text-xs font-medium text-red-400'>{errors.email?.message}</p>}
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Order ID *</label>
//           <input
//             type="text"
//             {...register("orderID")}

//             required
//             className="w-full border rounded-md px-3 py-2"
//           />
//             {errors?.orderID &&
//                         <p className='text-xs font-medium text-red-400'>{errors.orderID?.message}</p>}
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Product Name</label>
//           <input
//             type="text"
//             {...register("productname")}

//             className="w-full border rounded-md px-3 py-2"
//           />
//             {errors?.productname &&
//                         <p className='text-xs font-medium text-red-400'>{errors.productname?.message}</p>}
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Issue Description *</label>
//           <textarea
//             {...register("discription")}
//             rows={5}
//             required
//             className="w-full border rounded-md px-3 py-2"
//           ></textarea>
//             {errors?.discription &&
//                         <p className='text-xs font-medium text-red-400'>{errors.discription?.message}</p>}
//         </div>
// {/* 
//         <div>
//           <label className="block font-medium mb-1">Upload Photo/Video</label>
//           <input
//             type="file"
//             accept="image/*,video/*"

//             className="w-full"
//           />
//         </div> */}

//         <button
//           type="submit"
//           className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
//         >
//           {
//             submitting ? "Submitting..." :"Submit Claim"
//           }
//         </button>

//       </form>
//     </div>
//   )
// }

// export default ClaimRequestFrom
"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, X, Loader2 } from "lucide-react"
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// Zod validation schema
const claimFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  orderID: z.string().min(1, "Order ID is required"),
  productname: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

type ClaimFormValues = z.infer<typeof claimFormSchema>

interface UploadedFile {
  file: File
  preview: string
  type: "image" | "video"
}

export default function ProductClaimForm() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [claimId, setClaimId] = useState<string>("")
  const { executeRecaptcha } = useGoogleReCaptcha()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      name: "",
      email: "",
      orderID: "",
      productname: "",
      description: "",
    },
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")

      if (!isImage && !isVideo) {
        alert("Please upload only image or video files")
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 50MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const preview = event.target?.result as string
        setUploadedFiles((prev) => [
          ...prev,
          {
            file,
            preview,
            type: isImage ? "image" : "video",
          },
        ])
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ""
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ClaimFormValues) => {
    if (!executeRecaptcha) {
      setSubmitError("reCAPTCHA not loaded. Please refresh the page.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Get reCAPTCHA token
      const token = await executeRecaptcha("submit_claim")

      // Create FormData
      const formDataToSend = new FormData()
      formDataToSend.append("token", token)
      formDataToSend.append("name", data.name)
      formDataToSend.append("email", data.email)
      formDataToSend.append("orderID", data.orderID)
      formDataToSend.append("productname", data.productname)
      formDataToSend.append("description", data.description)

      // Append files
      uploadedFiles.forEach((file) => {
        formDataToSend.append("files", file.file)
      })

      // Debug logs
      console.log("Sending data:", {
        token: token ? "present" : "missing",
        name: data.name,
        email: data.email,
        orderID: data.orderID,
        productname: data.productname,
        description: data.description,
        filesCount: uploadedFiles.length,
      })

      // Submit to API
      const response = await fetch("/api/claimproduct", {
        method: "POST",
        body: formDataToSend,
      })

      console.log("API Response Status:", response.status)

      if (!response.ok) {
        let errorMessage = "Failed to submit claim"
        try {
          const result = await response.json()
          console.log("Error Response:", result)
          errorMessage = result.error || errorMessage
        } catch (e) {
          console.error("Failed to parse error response:", e)
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Success Response:", result)

      // Success
      setSubmitSuccess(true)
      setClaimId(result.claim_id || "")
      reset()
      setUploadedFiles([])

      setTimeout(() => {
        setSubmitSuccess(false)
        setClaimId("")
      }, 10000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError(
        error instanceof Error ? error.message : "Error submitting claim. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Product Claim</CardTitle>
          <CardDescription>
            Please provide details about your product issue and upload supporting images or videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-semibold">Your claim has been submitted successfully!</p>
                  {claimId && (
                    <div className="bg-white border border-green-300 rounded-md p-3 mt-2">
                      <p className="text-sm text-gray-700">Your Claim ID:</p>
                      <p className="text-lg font-bold text-green-700">{claimId}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Please save this ID to track your claim. A confirmation email has been sent to your email address.
                      </p>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {submitError && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Order ID Field */}
            <div className="space-y-2">
              <label htmlFor="orderID" className="text-sm font-medium">
                Order ID *
              </label>
              <Input
                id="orderID"
                placeholder="ORD-001234"
                {...register("orderID")}
              />
              <p className="text-sm text-gray-500">
                You can find this in your order confirmation email
              </p>
              {errors.orderID && (
                <p className="text-sm text-red-600">{errors.orderID.message}</p>
              )}
            </div>

            {/* Product Name Field */}
            <div className="space-y-2">
              <label htmlFor="productname" className="text-sm font-medium">
                Product Name *
              </label>
              <Input
                id="productname"
                placeholder="e.g., Red Sneaker Size 10"
                {...register("productname")}
              />
              {errors.productname && (
                <p className="text-sm text-red-600">{errors.productname.message}</p>
              )}
            </div>

            {/* Issue Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Issue Description *
              </label>
              <Textarea
                id="description"
                placeholder="Please describe the issue in detail..."
                rows={5}
                {...register("description")}
              />
              <p className="text-sm text-gray-500">
                Provide as much detail as possible about the problem
              </p>
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Upload Images or Videos</label>
                <p className="text-sm text-gray-500">
                  Upload photos or videos of the product issue (optional)
                </p>
              </div>

              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, WebM (Max 50MB each)</p>
                </div>
              </label>

              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                        {file.type === "image" ? (
                          <img
                            src={file.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video src={file.preview} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{file.file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Claim"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}