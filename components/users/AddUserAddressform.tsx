"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@/Contexts/Auth.context";
import { toast } from "sonner";
import {
  MapPin,
  User,
  Phone,
  Home,
  Briefcase,
  MoreHorizontal,
  CheckCircle2,
  Navigation,
  Loader2,
  Building2
} from "lucide-react";

const addressFromSchema = z.object({
  name: z.string().min(2, "Address label is required"),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  state_name: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pin_code: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
  full_address: z.string().min(8, "Detailed address is required"),
  landmark: z.string().optional(),
  isdefault: z.boolean(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormInputs = z.infer<typeof addressFromSchema>;

export default function AddUserAddressForm({
  handleperform,
  hideHeader = false,
  className,
}: {
  handleperform?: (data: any) => void;
  hideHeader?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [selectedLabelOption, setSelectedLabelOption] = useState<string | null>(null);
  const [showOtherLabel, setShowOtherLabel] = useState(false);

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
      isdefault: false,
      name: "",
    }
  });

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
        } else {
          toast.error("Invalid Pin Code");
        }
      } catch {
        toast.error("Network error fetching location");
      } finally {
        setLoadingPincode(false);
      }
    };

    fetchCityState();
  }, [pinCodeValue, setValue]);

  async function onSubmit(data: FormInputs) {
    try {
      if (!user?.id) {
        toast.error("Please login to add an address");
        return;
      }
      const response = await axios.post("/api/create-address", {
        ...data,
        user_id: user.id,
      });
      toast.success("Address secured in registry");
      reset();
      setSelectedLabelOption(null);
      setShowOtherLabel(false);
      const createdRecord = Array.isArray(response.data?.data)
        ? response.data.data[0]
        : (response.data?.data || response.data);
      handleperform && handleperform(createdRecord);
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to add address");
    }
  }

  const labelIcons = {
    Home: <Home size={16} />,
    Work: <Briefcase size={16} />,
    Other: <MoreHorizontal size={16} />
  };

  return (
    <div className={cn("w-full bg-white rounded-2xl p-4 md:p-6", className)}>
      {!hideHeader && (
        <div className="flex flex-col gap-1 mb-5">
          <span className="text-[10px] font-semibold  tracking-wider text-zinc-400">Delivery Address</span>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Add New Address
          </h2>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Address Label Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700">
            Address Label *
          </label>
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
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all ${selectedLabelOption === label
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
            <div className="relative mt-1 group">
              <input
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="Custom address label..."
                {...register("name")}
              />
              <CheckCircle2 size={10} className="absolute right-4 top-3.5 text-gray-300 group-focus-within:text-black transition-colors" />
            </div>
          )}
          {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Recipient Identity */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold tracking-wider text-gray-500 ml-1">Recipient Name</label>
            <div className="relative ">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="Full Legal Name"
                {...register("recipientName")}
              />
            </div>
            {errors.recipientName && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.recipientName.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold tracking-wider text-gray-500 ml-1">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="Phone Number"
                {...register("recipientPhone")}
              />
            </div>
            {errors.recipientPhone && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.recipientPhone.message}</p>}
          </div>

          {/* Pin Code / Auto-detect */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold tracking-wider text-gray-500 ml-1">Pincode</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="6-Digit Pincode"
                {...register("pin_code")}
              />
            </div>
            {errors.pin_code && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.pin_code.message}</p>}
          </div>

          {/* Landmark */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold tracking-wider text-gray-500 ml-1">Landmark (Optional)</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="Nearby landmark / famous place"
                {...register("landmark")}
              />
            </div>
          </div>

          {/* City - Dynamic Input */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold tracking-wider text-gray-500 ml-1">City / District</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="Auto-populated"
                {...register("city")}
              />
            </div>
            {errors.city && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.city.message}</p>}
          </div>

          {/* State - Dynamic Input */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold tracking-wider text-gray-500 ml-1">State / Province</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="Auto-populated"
                {...register("state_name")}
              />
            </div>
            {errors.state_name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.state_name.message}</p>}
          </div>

          {/* Full Detailed Address */}
          <div className="col-span-1 md:col-span-2 space-y-2 group">
            <label className="text-[11px] font-bold tracking-wider text-gray-500 ml-1">Full Address</label>
            <div className="relative">
              <textarea
                rows={3}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none resize-none"
                placeholder="Flat, House no., Building, Street name, Area"
                {...register("full_address")}
              />
            </div>
            {errors.full_address && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.full_address.message}</p>}
          </div>
        </div>

        {/* Default toggle */}
        <div className="flex items-center gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/60">
          <input
            type="checkbox"
            id="default-check"
            className="w-4 h-4 accent-zinc-900 rounded cursor-pointer"
            {...register("isdefault")}
          />
          <label htmlFor="default-check" className="text-xs font-medium text-zinc-700 cursor-pointer select-none">
            Set as default address
          </label>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:bg-zinc-300 shadow-sm"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Address"}
        </button>
      </form>
    </div>
  );
}
