import React from 'react'
import { orderData } from '@/types/interfaces';

function PaymentOption({ orderID,email,username }:orderData) {


  const sendMessage = () => {
    const phoneNumber = "9702456322";
    const message = encodeURIComponent(`Hello! I have successfully placed an order.Order ID: ${orderID}  Name: ${username}  Email: ${email} Please confirm the order status and share further details. Thank you!`);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(url, '_blank');
  }

  return (
    <section className='w-full  flex flex-col items-start justify-between  h-[300px]   p-10'>
      <div className='w-full relative h-[250px] flex-col flex items-center justify-center gap-1'>
        <p className='text-lg font-semibold text-green-800 text-center '>We are Not Supporting online Payment yet</p>
        <p className='text-base font-medium text-black text-center  '>use WhatsApp To conform Your Order with Payment</p>
      </div>
      <div className='relative h-auto flex  w-full items-center justify-center  px-10 gap-5'>
        <button className='w-fit relative h-auto px-3 py-1 text-white bg-black  cursor-pointer border border-transparent hover:border-black hover:text-black hover:bg-white  ' disabled={email || orderID ? false : true} onClick={sendMessage}>WhatsApp</button>
        {/* <button className='w-fit relative h-auto px-3 py-1 text-white bg-black cursor-pointer border border-transparent hover:border-black hover:text-black hover:bg-white  '>Buy iT</button>                 */}
      </div>
    </section>
  )
}

export default PaymentOption