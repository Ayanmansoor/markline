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
import { AddressProps, newCartItem, NewForProductsProps, OrderProps, userinterfce } from "@/types/interfaces";
import LoginModal from "./LoginModal"; // Import the LoginModal
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import LoadRazorpay from "@/utils/loadrazorpay";
import UpdateLocalstorageForOrder from "@/lib/UpdateLocalStorageForOrder";
import SendMail from "@/lib/SendMailHelper";
import { toast } from "sonner";
import { useUserAddress } from "@/Contexts/UserAddressProvider";
import { addressprops } from "../users/AddressSection";
import { useCartContext } from "@/Contexts/Cart.context";

function CheckoutAddressSelect({
    cartItems,   // ← NEW
    setConfirm,
    userAddress
}: {
    cartItems: newCartItem[],
    setConfirm: any
    userAddress?: AddressProps[]
}) {
    const [selectedAddress, setSelectedAddress] = useState<AddressProps | null>(null);
    const [currentuser, setUser] = useState<userinterfce | null>(null);
    const { clearCart } = useCartContext()
    // const [Useraddress, setUserAddress] = useState<AddressProps[] | null>([]);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();
    const getLocation = () =>
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    });
                },
                (err) => reject(err)
            );
        });




    console.log(userAddress, 'this is currrent user address ')





    const { totalAmount, cartWithPrices } = useMemo(() => {
        let total = 0;

        const processed = cartItems.map(item => {
            const price = item.variant.price;


            const discountPercent = item.variant.discounts?.discount_persent || 0;
            const discountAmt = price * (discountPercent / 100);
            const finalPrice = Math.floor(price - discountAmt);

            total += finalPrice * item.quantity;

            return {
                ...item,
                finalPrice,
                discountAmt
            };
        });

        return {
            totalAmount: total,
            cartWithPrices: processed
        };
    }, [cartItems]);



    const saveBeforePayment = async () => {
        try {
            setIsSubmittingOrder(true);
            // const { latitude, longitude }: any = await getLocation();
            if (!executeRecaptcha) {
                console.warn("reCAPTCHA not loaded.");
                setIsSubmittingOrder(false);
                return;
            }

            const token = await executeRecaptcha();
            const orders: any[] = cartWithPrices?.map((item: any) => {

                console.log(item, "this data")

                const orderPayload = {
                    user_id: currentuser?.id,
                    address_id: selectedAddress?.id,
                    total_amount: totalAmount,
                    longitude: "",
                    latitude: "",
                    product_key: item.productId,
                    variant_id: item.variant.id,
                    quantity: item.quantity,
                    final_price: item.finalPrice,
                    discount_amount: item.discountAmt,
                    discount_id: item?.variant?.discount_key,
                    color: JSON.stringify(item.variant.selectedColor),
                    size: JSON.stringify(item.variant.selectedSize),
                }
                return orderPayload
            })



            // console.log(orders, 'this is order payload  dataa')

            const { data } = await axios.post("/api/bulk-place-order", {
                products: orders,
                recaptchaToken: token,
            });

            if (setConfirm) {
                setConfirm("password")
            }

            console.log(data, "this is save befor order")

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
                amount: totalAmount * 100,
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
                    finalizeOrderPayment(response, currentuser, savedOrder),
                prefill: {
                    email: currentuser?.email,
                    contact: currentuser?.phone || currentuser?.user_metadata?.phone || "",
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
            console.log(savedOrder, "this is order finalize data",)

            const { data } = await axios.post('/api/bulk-update-orders', {
                OrderedProducts: savedOrder,
                user_id: user?.id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
            });
            console.log(data, "this is order finalize data",)
            setIsSubmittingOrder(false);
            await UpdateLocalstorageForOrder();
            await SendMail({ data: [data.updated], user: user, address: selectedAddress });
            clearCart()
        } catch (error) {
            toast("We received your payment , Our Team contact you shortly, ")
            console.error("Finalize Order Error:");
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
            <Button
                className="w-fit  mt-4  absolute bottom-5  right-5"
                onClick={saveBeforePayment}
                disabled={isSubmittingOrder}
            >
                {isSubmittingOrder ? "Processing..." : `Pay ₹${totalAmount}`}
            </Button>
        </>
    );
}

export default CheckoutAddressSelect;
