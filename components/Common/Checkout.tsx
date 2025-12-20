import Link from 'next/link';
import React from 'react';
import CheckOutButton from './CheckoutButton';


interface CheckoutProps {
    totalPrice: number;
    totalMrp: number;
    totaldiscount: number;
    coupondiscount: number;
}

function Checkout({
    totalPrice,
    totalMrp,
    totaldiscount,
    coupondiscount,
}: CheckoutProps) {




    return (
        <>
            {
                totalPrice > 0 ?
                    <section className="flex flex-col gap-3 p-5 rounded-lg border-gray-200 border">
                        <span className="flex items-center justify-between text-base font-medium">
                            <p className="text-base font-semibold text-text-primary">Subtotal:</p>
                            <p className="text-base font-semibold text-text-primary">₹{totalMrp}</p>
                        </span>

                        <span className="flex items-center justify-between border-b border-gray-200 pb-3 text-base font-medium">
                            <p className="text-base font-semibold text-text-primary">Product Discount:</p>
                            <p className="text-base font-semibold text-red-500">₹{totaldiscount}</p>
                        </span>



                        <span className="flex items-center justify-between text-base font-medium mt-3">
                            <p className="text-base font-semibold text-text-primary">Total Payable:</p>
                            <p className="text-lg font-semibold text-green-500">₹{totalPrice}</p>
                        </span>


                        {/* <CartsCheckoutRazorpay className="text-lg cursor-pointer mt-3 rounded-lg bg-[#E39C2E] text-white w-full py-2 px-2" amount={totalPrice} btntxt={'Checkout'} couponId={coupon?.id} /> */}

                        <CheckOutButton  >
                            <button
                                className="px-4 py-2 bg-primary text-white bg-green-500  rounded-md hover:bg-priamry"
                            >
                                Checkout
                            </button>
                        </CheckOutButton>

                        <img
                            src="/paymentOption.svg"
                            alt="paymentOption"
                            className="w-full relative h-auto object-contain mt-3"
                            height={100}
                            width={200}
                        />
                    </section>
                    :
                    <section className="flex flex-col gap-3 p-5 rounded-lg border-gray-200 border">

                        <button className="text-lg cursor-pointer mt-3 rounded-lg bg-primary text-white w-full py-2 px-2">
                            Start Shoping Now
                        </button>

                    </section>
            }
        </>
    );
}

export default Checkout;
