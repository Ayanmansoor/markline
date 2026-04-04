'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import LoadRazorpay from '@/utils/loadrazorpay'
import { 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Navigation,
  Loader2,
  Building2,
  PackageCheck,
  CreditCard
} from "lucide-react";
import { NewAddressFromProps, OrderProps } from '@/types/interfaces'
import UpdateLocalstorageForOrder from '@/lib/UpdateLocalStorageForOrder'
import { toast } from 'sonner'

const addressFromSchema = z.object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit phone number"),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
    state_name: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    full_address: z.string().min(8, "Detailed address is required"),
    landmark: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

type FormInputs = z.infer<typeof addressFromSchema>;

function AddressForm({ product, setConfirm, setOrderID, variant }: NewAddressFromProps) {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [isOrderSub, setOrderSub] = useState<boolean>(false)
    const [loadingPincode, setLoadingPincode] = useState(false)

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormInputs>({
        resolver: zodResolver(addressFromSchema),
    })

    const pinCodeValue = watch("pin_code");

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setValue("latitude", pos.coords.latitude);
                setValue("longitude", pos.coords.longitude);
            },
            (err) => console.warn("Location error:", err)
        );
    }, [setValue]);

    useEffect(() => {
        const fetchCityState = async () => {
            if (!pinCodeValue || pinCodeValue.length !== 6) return;
            try {
                setLoadingPincode(true);
                const res = await axios.get(`https://api.postalpincode.in/pincode/${pinCodeValue}`);
                const data = res.data[0];
                if (data.Status === "Success") {
                    const { District, State } = data.PostOffice[0];
                    setValue("city", District, { shouldValidate: true });
                    setValue("state_name", State, { shouldValidate: true });
                    toast.success(`Location detected: ${District}, ${State}`);
                }
            } catch {
                toast.error("Error fetching location");
            } finally {
                setLoadingPincode(false);
            }
        };
        fetchCityState();
    }, [pinCodeValue, setValue]);

    const { final_price, discountPrice } = useMemo(() => {
        const discountPercent = variant?.discounts?.discount_persent || 0;
        const discountPrice = variant?.price * (discountPercent / 100);
        const final_price = Math.floor(variant?.price - discountPrice);
        return { final_price, discountPrice };
    }, [variant, product]);

    async function saveBeforePayment(data: FormInputs) {
        try {
            setOrderSub(true)
            if (!executeRecaptcha) {
                toast.error("Security verification failed");
                setOrderSub(false)
                return;
            }
            const recaptchaToken = await executeRecaptcha()

            const orders = {
                ...data,
                final_price,
                quantity: product.quantity,
                discount_amount: discountPrice,
                variant_id: variant.id,
                color: product.selectedColor,
                size: product.selectedSize,
                product_key: product.id,
            }

            const response = await axios.post('/api/place-my-order', {
                orderdata: orders,
                recaptchaToken
            })
            await onSubmit(response.data.data)
        } catch (error) {
            toast.error("Order initialization failed");
            console.error(error);
            setOrderSub(false)
        }
    }

    async function onSubmit(data: OrderProps) {
        try {
            const response = await axios.post('/api/create-order', {
                amount: final_price * 100,
            });

            const res = await LoadRazorpay();
            if (!res) {
                toast.error('Failed to load payment portal');
                setOrderSub(false)
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: response.data.amount,
                one_click_checkout: true,
                currency: response.data.currency,
                name: "Markline",
                description: `Payment for ${product.id}`,
                order_id: response.data.id,
                image: "https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png",
                handler: (response) => orderSubmition(response, data),
                prefill: {
                    name: data.name,
                    email: data.email,
                    contact: data.phone,
                },
                theme: { color: "#000000" },
            };
            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
            setConfirm && setConfirm("password");
        } catch (err) {
            toast.error("Payment portal error");
            setOrderSub(false);
        }
    }

    async function orderSubmition(razorpayresponse: any, SavedOrders: OrderProps) {
        try {
            await axios.post(`/api/update-order`, {
                SavedOrders,
                user_id: "",
                razorpay_payment_id: razorpayresponse.razorpay_payment_id,
                razorpay_order_id: razorpayresponse.razorpay_order_id,
                razorpay_signature: razorpayresponse.razorpay_signature,
            });
            setOrderSub(false)
            await UpdateLocalstorageForOrder()
            toast.success("Payment successful! Order placed.");
        } catch (error) {
            toast.error("Payment received but registry update failed. We will contact you.");
            setOrderSub(false)
        }
    }

    return (
        <div className="w-full bg-white rounded-3xl p-1 shadow-sm">
            <div className="flex items-center gap-2 mb-6 px-1">
                <PackageCheck className="text-black" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Delivery Manifest</span>
            </div>

            <form onSubmit={handleSubmit(saveBeforePayment)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="CLIENT NAME"
                                {...register("name")}
                            />
                            <User size={16} className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        {errors.name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="EMAIL@EXAMPLE.COM"
                                {...register("email")}
                            />
                            <Mail size={16} className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Contact Phone</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="10-DIGIT MOBILE"
                                {...register("phone")}
                            />
                            <Phone size={16} className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        {errors.phone && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.phone.message}</p>}
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Postal Code</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="6-DIGIT PIN"
                                {...register("pin_code")}
                            />
                            <Navigation size={16} className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                            {loadingPincode && <Loader2 size={16} className="absolute right-3.5 top-3 text-black animate-spin" />}
                        </div>
                        {errors.pin_code && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.pin_code.message}</p>}
                    </div>

                    {/* Landmark */}
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Landmark</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="NEARBY FAMOUS SPOT"
                                {...register("landmark")}
                            />
                            <Building2 size={16} className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">City / District</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="AUTO-DETECTED"
                                {...register("city")}
                            />
                            <MapPin size={16} className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        {errors.city && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.city.message}</p>}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">State / Province</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="AUTO-DETECTED"
                                {...register("state_name")}
                            />
                            <MapPin size={16} className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        {errors.state_name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.state_name.message}</p>}
                    </div>
                </div>

                {/* Full Address */}
                <div className="space-y-1.5 group">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Detailed Address</label>
                    <textarea
                        rows={2}
                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none resize-none"
                        placeholder="HOUSE NO, STREET, AREA..."
                        {...register("full_address")}
                    />
                    {errors.full_address && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.full_address.message}</p>}
                </div>

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={isOrderSub}
                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-400"
                    >
                        {isOrderSub ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>PROCESSING...</span>
                            </>
                        ) : (
                            <>
                                <CreditCard size={18} />
                                <span>PROCEED TO PAYMENT</span>
                            </>
                        )}
                    </button>
                    <p className="text-center text-[9px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
                        ESTIMATED DELIVERY: 3-5 BUSINESS DAYS
                    </p>
                </div>
            </form>
        </div>
    )
}

export default AddressForm