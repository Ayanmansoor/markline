"use client";
import React, { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { StateCombobox } from "../FormComponents/StateCombobox";
import { CityNameCombobox } from "../FormComponents/CityNameCombobox";
import { toast } from "sonner";
import { UserInterface } from "@/types/interfaces";
const addressFromSchema = z.object({
  name: z.string().min(2, "Name is not valid "),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  state_name: z.string(),
  city: z.string(),
  pin_code: z.string().regex(/^\d{6}$/, "Pin code must be valid"),
  full_address: z.string().min(8, "Address must be at required"),
  isdefault: z.boolean(), // ✅ FIX
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormInputs = z.infer<typeof addressFromSchema>;

export default function AddUserAddressForm({
  handleperform,
}: {
  handleperform?: (data: any) => void;
}) {
  const [User, setUser] = useState<UserInterface>();
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [selectedLabelOption, setSelectedLabelOption] = useState<string | null>(
    null
  );
  const [showOtherLabel, setShowOtherLabel] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(addressFromSchema),
  });

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await mysupabase.auth.getUser();
      if (user) setUser(user);
    }
    getUser();
  }, []);

  function setStateValue(stateName: string) {
    setValue("state_name", stateName);
  }

  function setCityValue(cityName: string) {
    setValue("city", cityName);
  }

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
      const pincode = watch().pin_code;
      if (!pincode || pincode.length !== 6) return;

      try {
        setLoadingPincode(true);
        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = res.data[0];

        if (data.Status === "Success") {
          const { District, State } = data.PostOffice[0];
          setValue("city", District);
          setValue("state_name", State);
          toast.success(`Auto-filled: ${District}, ${State}`);
        }
      } catch {
        toast.error("Failed to fetch location from pincode");
      } finally {
        setLoadingPincode(false);
      }
    };

    fetchCityState();
  }, [watch().pin_code, setValue]);

  async function onSubmit(data: any) {
    try {
      const newaddress = await axios.post("/api/create-address", {
        ...data,
        user_id: User?.id,
      });
      toast.success("Address added successfully");
      reset();
      handleperform && handleperform(newaddress);
    } catch (error) {
      console.log("API error:", error);
      toast.error("Failed to add address");
    }
  }

  return (
    <div className="w-full bg-gray-100 border border-gray-200 rounded-md p-5">
      <h2 className="text-lg font-semibold text-primary border-b pb-3 mb-4">
        Add New Address
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-3"
      >
        {/* name */}
        <div className="flex flex-col col-span-2 gap-2">
          <label className="text-base text-text-primary font-medium">
            Label Name *
          </label>

          {/* Badge Buttons */}
          <div className="flex gap-3">
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
          px-4 py-1 rounded-full border transition
          ${
            selectedLabelOption === label
              ? "bg-text-secondary text-white"
              : "bg-gray-100"
          }
        `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Show custom input if "Other" is selected */}
          {showOtherLabel && (
            <input
              className="border px-4 py-2 rounded-md bg-gray-100 mt-2"
              placeholder="Enter custom label..."
              {...register("name")}
            />
          )}
        </div>

        {/* recipientName */}
        <div className="col-span-1">
          <label className="text-sm font-medium">Recipient Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md border-gray-200"
            placeholder="Enter Your Recipient Name "
            {...register("recipientName")}
          />
          {errors.recipientName && (
            <p className="text-red-500 text-xs">
              {errors.recipientName.message}
            </p>
          )}
        </div>

        {/* recipientPhone */}
        <div className="col-span-1">
          <label className="text-sm font-medium">Recipient Phone</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md border-gray-200"
            placeholder="Enter Your Recipient Phone "
            {...register("recipientPhone")}
          />
          {errors.recipientPhone && (
            <p className="text-red-500 text-xs">
              {errors.recipientPhone.message}
            </p>
          )}
        </div>

        {/* pin code */}
        <div className="col-span-1">
          <label className="text-sm font-medium">Pin Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md border-gray-200"
            placeholder="Enter Your Pin Code "
            {...register("pin_code")}
          />
          {loadingPincode && (
            <p className="text-blue-500 text-xs">Fetching...</p>
          )}
          {errors.pin_code && (
            <p className="text-red-500 text-xs">{errors.pin_code.message}</p>
          )}
        </div>

        {/* state combobox */}
        <StateCombobox
          setStateValue={setStateValue}
          errormessage={errors.state_name?.message || ""}
          selectedState={watch().state_name}
        />

        {/* city combobox */}
        <CityNameCombobox
          setCityName={setCityValue}
          errormessage={errors.city?.message || ""}
          statename={watch().state_name}
          selectcity={watch().city}
        />

        {/* full address */}
        <div className="col-span-2">
          <label className="text-sm font-medium">Full Address</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            {...register("full_address")}
          />
          {errors.full_address && (
            <p className="text-red-500 text-xs">
              {errors.full_address.message}
            </p>
          )}
        </div>

        {/* default checkbox */}
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" {...register("isdefault")} />
          <label className="text-sm font-medium">
            Use this address as default
          </label>
        </div>

        <button className="col-start-2 bg-primary text-white px-5 py-2 rounded justify-self-end">
          Add Address
        </button>
      </form>
    </div>
  );
}
