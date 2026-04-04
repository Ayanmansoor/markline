'use client'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressDailogprops } from '@/types/interfaces'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { 
  MapPin, 
  User, 
  Phone, 
  Home, 
  Briefcase, 
  MoreHorizontal, 
  Navigation,
  Loader2,
  Building2,
  CheckCircle2
} from "lucide-react";
import { toast } from 'sonner'

const addressFromSchema = z.object({
    name: z.string().min(2, "Address label is required"),
    recipientName: z.string().min(2, "Recipient name is required"),
    recipientPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
    state_name: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
    is_selected: z.boolean().nullable().optional(),
    full_address: z.string().min(8, "Detailed address is required"),
    landmark: z.string().optional(),
    user_id: z.string(),
    id: z.number()   
})

type FormInputs = z.infer<typeof addressFromSchema>;

function UpdateAddress({children, currentaddress, handleperform}: addressDailogprops) {
    const [open, setOpen] = useState(false)
    const [loadingPincode, setLoadingPincode] = useState(false);
    const [selectedLabelOption, setSelectedLabelOption] = useState<string | null>(currentaddress?.name || null);
    const [showOtherLabel, setShowOtherLabel] = useState(!['Home', 'Work'].includes(currentaddress?.name || ''));

    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<FormInputs>({
        resolver: zodResolver(addressFromSchema),
        defaultValues: {
            name: currentaddress?.name,
            recipientName: currentaddress?.recipientName || "",
            recipientPhone: currentaddress?.recipientPhone || "",
            state_name: currentaddress?.state_name,
            city: currentaddress?.city,
            id: currentaddress?.id,
            user_id: currentaddress?.user_id,
            pin_code: currentaddress?.pin_code,
            is_selected: currentaddress?.is_selected,
            full_address: currentaddress?.full_address,
            landmark: currentaddress?.landmark || "",
        }
    });

    useEffect(() => {
        if (currentaddress) {
            reset({
                name: currentaddress.name,
                recipientName: currentaddress.recipientName || "",
                recipientPhone: currentaddress.recipientPhone || "",
                state_name: currentaddress.state_name,
                city: currentaddress.city,
                id: currentaddress.id,
                user_id: currentaddress.user_id,
                pin_code: currentaddress.pin_code,
                is_selected: currentaddress.is_selected,
                full_address: currentaddress.full_address,
                landmark: currentaddress.landmark || "",
            });
            setSelectedLabelOption(currentaddress.name);
            setShowOtherLabel(!['Home', 'Work'].includes(currentaddress.name));
        }
    }, [currentaddress, reset]);

    const {executeRecaptcha} = useGoogleReCaptcha()
    const pinCodeValue = watch("pin_code");

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
                    toast.success(`Location updated: ${District}, ${State}`);
                }
            } catch {
                toast.error("Error fetching location");
            } finally {
                setLoadingPincode(false);
            }
        };
        fetchCityState();
    }, [pinCodeValue, setValue]);
          
    async function onSubmit(data: FormInputs){
        try {
            if(!executeRecaptcha){
                toast.error("Security verification failed");
                return; 
            }
            const recaptchaToken = await executeRecaptcha()
            const response = await axios.post(`/api/update-address`, {
                ...data,
                recaptchaToken
            })
            toast.success("Address updated in registry");
            setOpen(false)
            handleperform && handleperform(response.data)
        } catch(error){
            toast.error("Failed to update address");
            console.error(error);
        }
    }

    const labelIcons = {
        Home: <Home size={16} />,
        Work: <Briefcase size={16} />,
        Other: <MoreHorizontal size={16} />
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='w-full max-w-[600px] bg-transparent border-none shadow-none p-0 overflow-y-auto max-h-[90vh] shadow-2xl'>
                <div className="w-full bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-2xl">
                    <div className="flex flex-col gap-1 mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Postal Registry</span>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic leading-none">
                            Update Jurisdiction
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Address Label Selector */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Address Identity *</label>
                            <div className="flex flex-wrap gap-3">
                                {["Home", "Work", "Other"].map((label) => (
                                    <button
                                        type="button"
                                        key={label}
                                        onClick={() => {
                                            setSelectedLabelOption(label);
                                            if (label === "Other") {
                                                setShowOtherLabel(true);
                                                setValue("name", "");
                                            } else {
                                                setShowOtherLabel(false);
                                                setValue("name", label);
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 transition-all font-bold text-xs uppercase tracking-widest
                                            ${selectedLabelOption === label ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                    >
                                        {labelIcons[label]}
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {showOtherLabel && (
                                <div className="relative mt-3 group">
                                    <input
                                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all"
                                        placeholder="CUSTOM LABEL..."
                                        {...register("name")}
                                    />
                                    <CheckCircle2 size={16} className="absolute right-4 top-3.5 text-gray-300 group-focus-within:text-black" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Recipient Name</label>
                                <div className="relative">
                                    <input {...register("recipientName")} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black outline-none" placeholder="RECIPIENT NAME" />
                                    <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Contact Phone</label>
                                <div className="relative">
                                    <input {...register("recipientPhone")} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black outline-none" placeholder="PHONE" />
                                    <Phone size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">PIN Code</label>
                                <div className="relative">
                                    <input {...register("pin_code")} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black outline-none" placeholder="6-DIGIT PIN" />
                                    <Navigation size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                    {loadingPincode && <Loader2 size={16} className="absolute right-3.5 top-3 animate-spin" />}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Landmark</label>
                                <div className="relative">
                                    <input {...register("landmark")} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black outline-none" placeholder="LANDMARK" />
                                    <Building2 size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">City</label>
                                <div className="relative">
                                    <input {...register("city")} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black outline-none" placeholder="AUTO-POPULATED" />
                                    <MapPin size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">State</label>
                                <div className="relative">
                                    <input {...register("state_name")} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-10 py-2.5 text-sm font-bold focus:bg-white focus:border-black outline-none" placeholder="AUTO-POPULATED" />
                                    <MapPin size={16} className="absolute left-3.5 top-3 text-gray-400" />
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Full Address</label>
                                <textarea {...register("full_address")} rows={2} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-black outline-none resize-none" placeholder="COMPLETE ADDRESS MANIFEST" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <input type="checkbox" id="default-check-u" className="w-4 h-4 accent-black" {...register("is_selected")} />
                            <label htmlFor="default-check-u" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider cursor-pointer">Set as primary jurisdiction</label>
                        </div>

                        <button disabled={isSubmitting} className="w-full bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "UPDATE REGISTRY"}
                        </button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateAddress