'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressDailogprops } from '@/types/interfaces'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { mysupabase } from '@/Supabase/SupabaseConfig'
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

function UpdateAddress({ children, currentaddress, handleperform }: addressDailogprops) {
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

    const { executeRecaptcha } = useGoogleReCaptcha()
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

    async function onSubmit(data: FormInputs) {
        try {
            if (!executeRecaptcha) {
                toast.error("Security verification failed");
                return;
            }
            const recaptchaToken = await executeRecaptcha()
            const { data: sessionData } = await mysupabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.post(`/api/update-address`, {
                ...data,
                recaptchaToken
            }, { headers })
            toast.success("Address updated in registry");
            setOpen(false)
            handleperform && handleperform(response.data)
        } catch (error) {
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
            <DialogContent className="w-full max-w-[560px] bg-white rounded-2xl border border-zinc-200/80 shadow-2xl p-6 md:p-7 max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col gap-1 mb-5 text-left">
                    <span className="text-[10px] font-semibold  tracking-wider text-zinc-400">Delivery Address</span>
                    <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight">
                        Edit Address
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Address Label Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-700">Address Label *</label>
                        <div className="flex flex-wrap gap-2.5">
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
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                                        selectedLabelOption === label
                                            ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                                            : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300"
                                    }`}
                                >
                                    {labelIcons[label]}
                                    {label}
                                </button>
                            ))}
                        </div>
                        {showOtherLabel && (
                            <div className="relative mt-2">
                                <input
                                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                                    placeholder="Custom label (e.g. Studio, Vacation Home)..."
                                    {...register("name")}
                                />
                                <CheckCircle2 size={14} className="absolute right-3.5 top-2.5 text-zinc-400" />
                            </div>
                        )}
                        {errors.name && <p className="text-[11px] font-medium text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">Recipient Name</label>
                            <div className="relative">
                                <input
                                    {...register("recipientName")}
                                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                                    placeholder="Full name"
                                />
                                <User size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                            </div>
                            {errors.recipientName && <p className="text-[11px] font-medium text-red-500">{errors.recipientName.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">Phone Number</label>
                            <div className="relative">
                                <input
                                    {...register("recipientPhone")}
                                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                                    placeholder="10-digit mobile number"
                                />
                                <Phone size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                            </div>
                            {errors.recipientPhone && <p className="text-[11px] font-medium text-red-500">{errors.recipientPhone.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">PIN Code</label>
                            <div className="relative">
                                <input
                                    {...register("pin_code")}
                                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                                    placeholder="6-digit PIN"
                                />
                                <Navigation size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                                {loadingPincode && <Loader2 size={14} className="absolute right-3 top-2.5 animate-spin text-zinc-500" />}
                            </div>
                            {errors.pin_code && <p className="text-[11px] font-medium text-red-500">{errors.pin_code.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">Landmark</label>
                            <div className="relative">
                                <input
                                    {...register("landmark")}
                                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                                    placeholder="Nearby landmark (optional)"
                                />
                                <Building2 size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">City</label>
                            <div className="relative">
                                <input
                                    {...register("city")}
                                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                                    placeholder="City"
                                />
                                <MapPin size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                            </div>
                            {errors.city && <p className="text-[11px] font-medium text-red-500">{errors.city.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">State</label>
                            <div className="relative">
                                <input
                                    {...register("state_name")}
                                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                                    placeholder="State"
                                />
                                <MapPin size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                            </div>
                            {errors.state_name && <p className="text-[11px] font-medium text-red-500">{errors.state_name.message}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">Full Address</label>
                            <textarea
                                {...register("full_address")}
                                rows={2}
                                className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors resize-none leading-relaxed"
                                placeholder="Flat, House no., Building, Street name, Area"
                            />
                            {errors.full_address && <p className="text-[11px] font-medium text-red-500">{errors.full_address.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/60">
                        <input
                            type="checkbox"
                            id="default-check-u"
                            className="w-4 h-4 accent-zinc-900 rounded cursor-pointer"
                            {...register("is_selected")}
                        />
                        <label htmlFor="default-check-u" className="text-xs font-medium text-zinc-700 cursor-pointer select-none">
                            Set as default address
                        </label>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs  tracking-wider transition-all flex items-center justify-center gap-2 disabled:bg-zinc-300 shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateAddress