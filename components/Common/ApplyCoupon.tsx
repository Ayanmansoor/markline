// 'use client'
// import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

// interface CouponProps {
//     setCouponValue: Dispatch<SetStateAction<PromoCodeProps | undefined>>
// }

// const couponSchema = z.object({
//     coupon: z.string().min(3, 'Coupon must be at least 3 characters'),
// })

// type CouponForm = z.infer<typeof couponSchema>

// function Applycoupon({ setCouponValue }: CouponProps) {
//     const [isSubmitting, setSubmitting] = useState(false)
//     const [coupons, setCoupons] = useState<PromoCodeProps[]>([])
//     const [selectedCoupon, setSelectedCoupon] = useState<PromoCodeProps | null>(null)

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//     } = useForm<CouponForm>({
//         resolver: zodResolver(couponSchema),
//     })

//     const fetchCoupons = async () => {
//         try {
//             const res = await apiClient.get('/user/promocodes')
//             setCoupons(res.data.promocodes || [])
//         } catch (error) {
//             console.error('Error fetching coupons:', error)
//         }
//     }

//     useEffect(() => {
//         fetchCoupons()
//     }, [])

//     const onSubmit = async (data: CouponForm) => {
//         try {
//             setSubmitting(true)
//             const response = await apiClient.get(`/user/promocodes/${data.coupon}`)
//             setSelectedCoupon(response.data.promocode)
//             reset()
//         } catch (error) {
//             console.error('Coupon not valid:', error)
//         } finally {
//             setSubmitting(false)
//         }
//     }

//     const handleCouponSelect = (code: string) => {
//         const found = coupons.find(c => c.code === code)
//         if (found) {
//             console.log(found, "ldsuhfkshklfhklshdlfhls")
//             setSelectedCoupon(found)
//             setCouponValue(found)
//         }
//     }

//     return (
//         <section className='w-full relative h-auto flex flex-col gap-3 border-gray-200 border rounded-lg'>
//             <section className='flex flex-col gap-2 p-5'>
//                 <h2 className='text-xl font-semibold text-text-primary'>Have a coupon?</h2>
//                 <form onSubmit={handleSubmit(onSubmit)} className='border border-gray-200 bg-white flex items-center overflow-hidden rounded-lg'>
//                     <input
//                         type="text"
//                         placeholder='Add Coupon'
//                         className='px-3 py-2 w-full bg-white placeholder:text-gray-400'
//                         {...register("coupon")}
//                     />
//                     <button
//                         className='text-base text-text-secondary px-2.5 py-1 cursor-pointer border-l border-gray-200'
//                         disabled={isSubmitting}
//                     >
//                         {isSubmitting ? 'Applying...' : 'Apply'}
//                     </button>
//                 </form>
//                 {errors.coupon && <p className="text-red-500 text-sm">{errors.coupon.message}</p>}
//             </section>

//             <section className='flex px-5 pb-5 flex-col gap-2'>
//                 <p className="font-medium text-text-primary">Or choose from available coupons:</p>
//                 <Select onValueChange={handleCouponSelect}>
//                     <SelectTrigger className="w-full bg-white">
//                         <SelectValue placeholder="Select a Coupon" />
//                     </SelectTrigger>
//                     <SelectContent>

//                         {coupons?.map((coupon) => (
//                             <SelectItem key={coupon.id} value={coupon.code}>
//                                 {coupon.code} - {coupon.discountType === 'FLAT' ? `₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>

//                 {/* {selectedCoupon && (
//           <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-3 gap-1.5 flex flex-col rounded-md">
//             <p><strong>Coupon:</strong> {selectedCoupon.code}</p>
//             <p><strong>Discount:</strong>
//               {selectedCoupon.discountType === 'FLAT'
//                 ? `₹${selectedCoupon.discountValue} off`
//                 : `${selectedCoupon.discountValue}% (up to ₹${selectedCoupon.maxDiscount})`
//               }
//             </p>
//             {selectedCoupon.description && <p><strong>Description:</strong> {selectedCoupon.description}</p>}
//           </div>
//         )} */}
//             </section>
//         </section>
//     )
// }

// export default Applycoupon
