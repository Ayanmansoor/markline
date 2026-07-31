"use client";
import React, { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { toast } from "sonner";
import { UserInterface } from "@/types/interfaces";
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
}: {
  handleperform?: (data: any) => void;
}) {
  const [UserObj, setUser] = useState<UserInterface>();
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
    async function getUser() {
      const {
        data: { user },
      } = await mysupabase.auth.getUser();
      if (user) setUser(user);
    }
    getUser();
  }, []);

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
      if (!UserObj?.id) {
        toast.error("Please login to add an address");
        return;
      }
      const response = await axios.post("/api/create-address", {
        ...data,
        user_id: UserObj.id,
      });
      toast.success("Address secured in registry");
      reset();
      setSelectedLabelOption(null);
      setShowOtherLabel(false);
      handleperform && handleperform(response.data);
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
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-2xl shadow-gray-200/50">
      <div className="flex flex-col gap-1 mb-8">
        <span className="text-[10px] font-black 
         tracking-[0.4em] text-gray-400">Postal Registry</span>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-black capitalize leading-none">
          Add New Address
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Address Label Selector */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold 
           tracking-wider text-gray-500 ml-1">
            Address Identity *
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
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
                className={`
                  flex items-center gap-2 px-6 py-1.5 rounded-full border-2 transition-all duration-300 font-bold text-xs 
                   tracking-widest
                  ${selectedLabelOption === label
                    ? "bg-black border-black text-white shadow-lg shadow-black/20"
                    : "bg-white border-gray-300 text-gray-400 hover:border-gray-200"
                  }
                `}
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
                placeholder="PROPOSE CUSTOM LABEL..."
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
            <label className="text-[11px] font-bold 
             tracking-wider text-gray-500 ml-1">Recipient Identity</label>
            <div className="relative ">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="FULL LEGAL NAME"
                {...register("recipientName")}
              />
            </div>
            {errors.recipientName && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.recipientName.message}</p>}
          </div>

          {/* Contact Link */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold 
             tracking-wider text-gray-500 ml-1">Contact Link</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="PHONE NUMBER"
                {...register("recipientPhone")}
              />
            </div>
            {errors.recipientPhone && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.recipientPhone.message}</p>}
          </div>

          {/* Pin Code / Auto-detect */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold 
             tracking-wider text-gray-500 ml-1">Jurisdiction Code (PIN)</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="6-DIGIT CODE"
                {...register("pin_code")}
              />
            </div>
            {errors.pin_code && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.pin_code.message}</p>}
          </div>

          {/* Landmark - NEW */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold 
             tracking-wider text-gray-500 ml-1">Visual Landmark</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="NEARBY FAMOUS PLACE"
                {...register("landmark")}
              />
            </div>
          </div>

          {/* City - Dynamic Input */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold 
             tracking-wider text-gray-500 ml-1">City / District</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="AUTO-POPULATED"
                {...register("city")}
              />
            </div>
            {errors.city && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.city.message}</p>}
          </div>

          {/* State - Dynamic Input */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-bold 
             tracking-wider text-gray-500 ml-1">State / Province</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                placeholder="AUTO-POPULATED"
                {...register("state_name")}
              />
            </div>
            {errors.state_name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.state_name.message}</p>}
          </div>

          {/* Full Detailed Address */}
          <div className="col-span-1 md:col-span-2 space-y-2 group">
            <label className="text-[11px] font-bold 
             tracking-wider text-gray-500 ml-1">Detailed Manifest (Full Address)</label>
            <div className="relative">
              <textarea
                rows={3}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-1.5 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none resize-none"
                placeholder="STREET NAME, HOUSE NUMBER, ETC."
                {...register("full_address")}
              />
            </div>
            {errors.full_address && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.full_address.message}</p>}
          </div>
        </div>

        {/* Default toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
          <input
            type="checkbox"
            id="default-check"
            className="w-5 h-5 accent-black rounded-lg cursor-pointer"
            {...register("isdefault")}
          />
          <label htmlFor="default-check" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
            ESTABLISH AS PRIMARY JURISDICTION (DEFAULT)
          </label>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full md:w-auto md:min-w-[200px] bg-black text-white px-8 py-4 rounded-xl font-black text-xs 
           tracking-[0.2em] shadow-xl shadow-black/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-400"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "SECURE ADDRESS"}
        </button>
      </form>
    </div>
  );
}
