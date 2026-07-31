import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Check } from "lucide-react";
import axios from "axios";
import { AddressProps, NewForProductsProps, OrderProps, userinterfce } from "@/types/interfaces";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import LoadRazorpay from "@/utils/loadrazorpay";
import UpdateLocalstorageForOrder from "@/lib/UpdateLocalStorageForOrder";
import SendMail from "@/lib/SendMailHelper";
import { toast } from "sonner";

function SelectOrder({ product, variant, user, setConfirm, userAddress }: NewForProductsProps) {
    const [selectedAddress, setSelectedAddress] = useState<AddressProps | null>(null);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
        if (userAddress && userAddress?.length > 0) {
            const defaultAddress = userAddress?.find(a => a.is_selected === true);
            setSelectedAddress(defaultAddress || userAddress[0]);
        }
    }, [userAddress]);

    const { unitPrice, final_price, discountAmount } = useMemo(() => {
        const price = variant?.price || (product as any)?.price || 0;
        const discountPercent = variant?.discounts?.discount_persent || (product as any)?.discounts?.discount_persent || 0;
        const discountAmt = price * (discountPercent / 100);
        const finalPriceOne = Math.floor(price - discountAmt);
        return { unitPrice: price, final_price: finalPriceOne, discountAmount: discountAmt };
    }, [product, variant]);

    const qty = product?.quantity || 1;
    const totalOrderAmount = final_price * qty;

    const saveBeforePayment = async () => {
        try {
            if (!selectedAddress) {
                toast.error("Please select a delivery address");
                return;
            }

            setIsSubmittingOrder(true);

            let token = "";
            if (executeRecaptcha) {
                token = await executeRecaptcha();
            }

            const orderPayload = {
                order_header: {
                    user_id: user?.id,
                    address_id: selectedAddress.id,
                    subtotal: unitPrice * qty,
                    discount_amount: discountAmount * qty,
                    shipping_charge: 0,
                    tax_amount: 0,
                    grand_total: totalOrderAmount,
                    payment_status: 'PENDING',
                    fulfillment_status: 'Pending',
                },
                order_items: [
                    {
                        product_id: product.id,
                        variant_id: variant?.id || null,
                        quantity: qty,
                        unit_price: unitPrice,
                        discount_amount: discountAmount,
                        final_price: totalOrderAmount,
                        color: typeof product?.selectedColor === 'object' ? JSON.stringify(product?.selectedColor) : product?.selectedColor,
                        size: typeof product?.selectedSize === 'object' ? JSON.stringify(product?.selectedSize) : product?.selectedSize,
                        discount_id: variant?.discounts?.discount_id || variant?.discount_key || null,
                    }
                ]
            };

            const { data } = await axios.post("/api/place-my-order", {
                orderdata: orderPayload,
                recaptchaToken: token,
            });

            if (setConfirm) {
                setConfirm("password");
            }

            await initiateRazorpayPayment(data.data);
        } catch (error: any) {
            toast.error(error?.response?.data?.error || "Order placement failed. Please try again.");
            console.error("Order Save Error:", error);
            setIsSubmittingOrder(false);
        }
    };

    const initiateRazorpayPayment = async (savedOrder: any) => {
        try {
            const { data } = await axios.post("/api/create-order", {
                amount: totalOrderAmount * 100,
            });

            const razorpayLoaded = await LoadRazorpay();
            if (!razorpayLoaded) {
                alert("Razorpay SDK failed to load");
                setIsSubmittingOrder(false);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Markline",
                description: "Secure Payment",
                order_id: data.id,
                image: "https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png",
                handler: (response: any) => finalizeOrderPayment(response, user, savedOrder),
                prefill: {
                    email: user?.email,
                    contact: user?.phone || user?.user_metadata?.phone || "",
                },
                theme: {
                    color: "#000000",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment Init Error:", error);
            setIsSubmittingOrder(false);
        }
    };

    const finalizeOrderPayment = async (
        razorpayResponse: any,
        userObj: any,
        savedOrder: any
    ) => {
        try {
            const { data } = await axios.post("/api/update-order", {
                SavedOrders: savedOrder,
                user_id: userObj?.id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
            });

            setIsSubmittingOrder(false);
            await UpdateLocalstorageForOrder();
            toast.success("Order confirmed successfully!");
            await SendMail({ data: [data.updated], user: userObj, address: selectedAddress });
        } catch (error) {
            toast("We received your payment, our team will update your manifest shortly.");
            console.error("Finalize Order Error:", error);
            setIsSubmittingOrder(false);
        }
    };

    return (
        <div className="w-full flex flex-col h-full overflow-hidden">
            <div className="w-full flex-1 overflow-y-auto pr-1">
                <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                    {userAddress?.map((address: any) => (
                        <div
                            key={address.id}
                            className="relative group cursor-pointer"
                            onClick={() => setSelectedAddress(address)}
                        >
                            <Label
                                className={cn(
                                    "flex flex-col gap-2 rounded-xl border-2 border-gray-200 bg-white p-4 hover:border-black transition-all cursor-pointer",
                                    selectedAddress?.id === address.id && "border-black bg-gray-50/50 shadow-md"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="font-black text-xs uppercase tracking-wider">{address.name || "Address"}</span>

                                        {address.is_selected && (
                                            <span className="rounded-full bg-black text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    {selectedAddress?.id === address.id && (
                                        <div className="h-5 w-5 rounded-full bg-black text-white flex items-center justify-center">
                                            <Check className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-xs text-gray-600 mt-1 space-y-0.5 font-medium">
                                    <div className="font-bold text-black uppercase">{address.recipientName || address.name}</div>
                                    <div className="line-clamp-2">{address.full_address}</div>
                                    <div>
                                        {address.city}, {address.state_name} {address.pin_code}
                                    </div>
                                    {address?.recipientPhone && <div className="mt-1 font-semibold text-black">{address.recipientPhone}</div>}
                                </div>
                            </Label>
                        </div>
                    ))}
                </section>
            </div>

            {userAddress && userAddress.length > 0 && (
                <div className="flex bg-white items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Payable</span>
                        <span className="text-xl font-black text-black tracking-tight">₹{totalOrderAmount}</span>
                    </div>

                    <Button
                        className="px-8 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-gray-800 transition-all active:scale-95 disabled:bg-gray-400"
                        onClick={saveBeforePayment}
                        disabled={isSubmittingOrder}
                    >
                        {isSubmittingOrder ? "Processing..." : "Proceed to Payment"}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default SelectOrder;
