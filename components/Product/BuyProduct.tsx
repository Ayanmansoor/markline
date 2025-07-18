// 'use client'
// import React, { useState } from 'react'
// import { useEffect } from 'react'
// import { BuyProductProps, userinterfce } from '@/types/interfaces'

// import axios from 'axios'
// import { mysupabase } from '@/Supabase/SupabaseConfig'
// import LoadRazorpay from '@/utils/loadrazorpay'


// function BuyProduct({product}:BuyProductProps) {
//      const [currentuser, setUser] = useState<userinterfce >();
    
    
//   useEffect(() => {
//     async function getSupabaseUser() {
//       const {
//           data: { user },
//           error,
//       } = await mysupabase.auth.getUser();

//       if (user) {
//         setUser(user);
//       }
    
//      const res = await LoadRazorpay();
//         if (!res) {
//                 alert('Failed to load Razorpay SDK');
//                 return;
//         }

//     }
   
//     getSupabaseUser()
//   }, [])


//     async function openMagicCheckout(){
//             const final_price = Math.floor(
//                 product?.price - (product?.price * (product?.discounts?.discount_persent || 0) / 100)
//             );
//             const response = await axios.post('/api/create-order', {
//                         amount: final_price * 100,
//             });

//            const options = {
//             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//             amount: response.data.amount,
//             // one_click_checkout: true,
//             currency: response.data.currency,
//             name: "Markline",
//             description: "Order description",
//             order_id: response.data.id,
//             image: "https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png",
//             handler: (response) => {}
//             };

//             const paymentObject = new window.Razorpay(options);
//             paymentObject.open();

//     }

//   return (
//         <button  className=' w-full relative  xl:px-5 py-4 bg-black text-white hover:border-black border border-transparent hover:bg-slate-100 hover:text-black  ' id="rzp-button1" onClick={openMagicCheckout} >Buy Now</button>
//   )
// }

// export default BuyProduct

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import LoadRazorpay from '@/utils/loadrazorpay';
import { BuyProductProps, userinterfce } from '@/types/interfaces';

function BuyProduct({ product }: BuyProductProps) {
  const [currentUser, setUser] = useState<userinterfce>();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await mysupabase.auth.getUser();
      if (user) {
        setUser(user);
      }

      const res = await LoadRazorpay();
      if (!res) {
        alert('Failed to load Razorpay Magic Checkout SDK');
      }
    }

    fetchUser();
  }, []);

  const openMagicCheckout = async () => {
    // if (!currentUser) {
    //   alert("Please log in first.");
    //   return;
    // }

    const final_price = Math.floor(
      product?.price - (product?.price * (product?.discounts?.discount_persent || 0) / 100)
    );

    // Create Razorpay Order
    const { data: order } = await axios.post('/api/create-order', {
      amount: final_price * 100,
    });

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // must be PUBLIC key
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'Markline',
      description: product.name || 'Luxury Product',
      image: 'https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png',

      // Magic Checkout-specific
      checkout: {
        // contact: currentUser.phone || '', // Optional: from Supabase
        // email: currentUser.email,
        method: {
          netbanking: true,
          card: true,   
          upi: true,
          wallet: true,
        },
     
        magic: {
          config: {
            prefill_shipping_address: true
        }
        },
        name: 'Markline',
        description: 'Luxury Product Checkout',
      },

      handler: function (response: any) {
        // Save order/payment in DB or show confirmation
        console.log("Payment successful:", response);
        // alert("Payment Successful!");
      },

      modal: {
        ondismiss: function () {
          console.log("Checkout closed by user");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button
      className="w-full relative xl:px-5 py-4 bg-black text-white hover:border-black border border-transparent hover:bg-slate-100 hover:text-black"
      onClick={openMagicCheckout}
    >
      Buy Now
    </button>
  );
}

export default BuyProduct;
