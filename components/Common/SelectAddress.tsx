// import React, { useEffect, useState } from "react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { MapPin, Check, Pencil, Trash2 } from "lucide-react"
// import { mysupabase } from "@/Supabase/SupabaseConfig"
// import axios from "axios"
// import { userinterfce } from "@/types/interfaces"

// function SelectOrder() {
//     const [addresses, setAddresses] = useState<any[]>([]);
//     const [selectedId, setSelectedId] = useState("");
//     const [currentuser, setUser] = useState<userinterfce>();

//     useEffect(() => {
//         async function getSupabaseUser() {
//             const {
//                 data: { user },
//                 error,
//             } = await mysupabase.auth.getUser();

//             if (user) {
//                 setUser(user);
//             }
//             // else{}
//         }
//         getSupabaseUser()
//     }, [])


//     useEffect(() => {
//         async function load() {
//             try {
//                 const res = await axios.get("/api/useraddress", {
//                     withCredentials: true,
//                 });

//                 const data = res.data;

//                 console.log(data, "this is data from API");
//                 setAddresses(data);

//                 const defaultAddress = data?.find((a: any) => a.is_selected);
//                 if (defaultAddress) {
//                     setSelectedId(defaultAddress.id);
//                 }

//             } catch (error) {
//                 console.error("Error loading addresses:", error);
//             }
//         }

//         load();
//     }, []);

//     const handleSelect = (id: string) => {
//         setSelectedId(id);
//     };


//     return (
//         <>
//             <section className="w-full relative h-auto flex flex-col gap-2">
//                 {addresses.map((address) => (
//                     <div key={address.id} className="relative group">
//                         <RadioGroupItem value={address.id} id={address.id} className="peer sr-only" />

//                         <Label
//                             htmlFor={address.id}
//                             className={cn(
//                                 "flex flex-col gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all",
//                                 selectedId === address.id && "border-primary"
//                             )}
//                         >
//                             <div className="flex justify-between items-start">
//                                 <div className="flex items-center gap-2">
//                                     <MapPin className="h-4 w-4 text-muted-foreground" />
//                                     <span className="font-semibold">{address.label || "Address"}</span>
//                                     {address.is_selected && (
//                                         <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
//                                             Default
//                                         </span>
//                                     )}
//                                 </div>

//                                 {selectedId === address.id && (
//                                     <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
//                                         <Check className="h-3 w-3" />
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="text-sm text-muted-foreground mt-1">
//                                 <div className="font-medium text-foreground">{address.name}</div>
//                                 <div>{address.street}</div>
//                                 <div>
//                                     {address.city}, {address.state} {address.zip}
//                                 </div>
//                                 <div>{address.country}</div>
//                                 <div className="mt-1">{address.phone}</div>
//                             </div>

//                             <div className="flex gap-2 mt-4 opacity-0 transition-opacity group-hover:opacity-100 peer-data-[state=checked]:opacity-100">
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-8 px-2 text-muted-foreground hover:text-foreground"
//                                     onClick={(e) => {
//                                         e.preventDefault()
//                                         e.stopPropagation()
//                                         // onEdit?.(address.id)
//                                     }}
//                                 >
//                                     <Pencil className="h-3.5 w-3.5 mr-1.5" />
//                                     Edit
//                                 </Button>

//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-8 px-2 text-muted-foreground hover:text-destructive"
//                                     onClick={(e) => {
//                                         e.preventDefault()
//                                         e.stopPropagation()
//                                         // onDelete?.(address.id)
//                                     }}
//                                 >
//                                     <Trash2 className="h-3.5 w-3.5 mr-1.5" />
//                                     Delete
//                                 </Button>
//                             </div>
//                         </Label>
//                     </div>
//                 ))}
//             </section>
//         </>
//     )
// }

// export default SelectOrder
import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Check, Pencil, Trash2 } from "lucide-react";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import axios from "axios";
import { AddressProps, NewForProductsProps, OrderProps, userinterfce } from "@/types/interfaces";
import LoginModal from "./LoginModal"; // Import the LoginModal
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import LoadRazorpay from "@/utils/loadrazorpay";
import UpdateLocalstorageForOrder from "@/lib/UpdateLocalStorageForOrder";
import SendMail from "@/lib/SendMailHelper";
import { toast } from "sonner";
import { useUserAddress } from "@/Contexts/UserAddressProvider";
import { addressprops } from "../users/AddressSection";

function SelectOrder({ product, variant, user, setConfirm, userAddress }: NewForProductsProps) {
    const [selectedAddress, setSelectedAddress] = useState<AddressProps | null>(null);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();

    // 🔥 Load user + addresses



    useEffect(() => {
        if (userAddress && userAddress?.length > 0) {
            const defaultAddress = userAddress?.find(a => a.is_selected === true);
            setSelectedAddress(defaultAddress || userAddress && userAddress[0]);
        }
    })

    // console.log("this is currrent user address ", variant)






    const { final_price, discountAmount } = useMemo(() => {
        const discountPercent = variant?.discounts?.discount_persent || 0;
        const discountAmount = variant?.price * (discountPercent / 100);
        const final_price = Math.floor(variant?.price - discountAmount);
        return { final_price, discountAmount };
    }, [product]);


    const saveBeforePayment = async () => {
        try {
            setIsSubmittingOrder(true);

            if (!executeRecaptcha) {
                console.warn("reCAPTCHA not loaded.");
                setIsSubmittingOrder(false);
                return;
            }

            const token = await executeRecaptcha();

            const orderPayload = {
                total_amount: final_price,
                final_price,
                quantity: product.quantity,
                discount_amount: discountAmount,
                discount_id: variant?.discount_key,
                product_key: product.id,
                user_id: user?.id,
                address_id: selectedAddress?.id,
                variant_id: variant?.id,

                color: JSON.stringify(product?.selectedColor),
                size: JSON.stringify(product?.selectedSize)
            };



            const { data } = await axios.post("/api/place-my-order", {
                orderdata: orderPayload,
                recaptchaToken: token,
            });
            if (setConfirm) {
                setConfirm("password")
            }
            await initiateRazorpayPayment(data.data);
        } catch (error) {
            toast("Somthing strength happnd . try again later ")
            console.error("Order Save Error:", error);
            setIsSubmittingOrder(false);
        }
    };

    const initiateRazorpayPayment = async (savedOrder: OrderProps) => {
        try {
            const { data } = await axios.post("/api/create-order", {
                amount: final_price * 100,
            });

            const razorpayLoaded = await LoadRazorpay();
            if (!razorpayLoaded) {
                alert("Razorpay SDK failed to load");
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                magic: true,
                one_click_checkout: true,
                name: "Markline",
                description: "Secure Payment",
                order_id: data.id,
                image:
                    "https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png",
                handler: (response: any) =>
                    finalizeOrderPayment(response, user, savedOrder),
                prefill: {
                    email: user?.email,
                    contact: user?.phone || user?.user_metadata?.phone || "",
                },
                theme: {
                    color: "#084E10",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment Init Error:",);
        }
    };

    const finalizeOrderPayment = async (
        razorpayResponse,
        user,
        savedOrder: OrderProps
    ) => {
        try {
            const { data } = await axios.post("/api/update-order", {
                SavedOrders: savedOrder,
                user_id: user?.id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
            });

            setIsSubmittingOrder(false);
            await UpdateLocalstorageForOrder();

            console.log(data, "this is order update data")

            await SendMail({ data: [data.updated], user: user, address: selectedAddress });
        } catch (error) {
            toast("We received your payment , Our Team contact you shortly, ")
            console.error("Finalize Order Error:", error);
            setIsSubmittingOrder(false);
        }
    };


    return (
        <>



            <div className="w-full relative max-h-full overflow-auto  ">
                <section className="w-full relative h-auto grid grid-cols-2 gap-2">
                    {userAddress?.map((address: any) => (
                        <div
                            key={address.id}
                            className="relative group cursor-pointer"
                            onClick={() => setSelectedAddress(address)}
                        >
                            <Label
                                className={cn(
                                    "flex flex-col gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground transition-all",
                                    selectedAddress?.id === address.id && "border-primary"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold">{address.name || "Address"}</span>

                                        {address.is_selected && (
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    {selectedAddress?.id === address.id && (
                                        <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-sm text-muted-foreground mt-1">
                                    <div className="font-medium text-foreground">{address.name}</div>
                                    <div>{address.full_address}</div>
                                    <div>
                                        {address.city}, {address.state_name} {address.pin_code}
                                    </div>
                                    <div className="mt-1">{address?.recipientPhone}</div>
                                </div>
                            </Label>
                        </div>
                    ))}
                </section>

            </div>
            {
                userAddress &&
                userAddress?.length > 0 &&
                <Button
                    className="w-fit  mt-4  absolute bottom-5  right-5 "
                    onClick={saveBeforePayment}
                    disabled={isSubmittingOrder}
                >
                    {isSubmittingOrder ? "Processing..." : "Proceed to Payment"}
                </Button>
            }

        </>
    );
}

export default SelectOrder;
