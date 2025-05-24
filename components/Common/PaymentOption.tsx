import React, { useEffect, useRef } from 'react'
import { OrderId } from '@/types/interfaces';
import TriggerConfiti from '@/lib/Triggerconfiti'
import { useCart } from '@/Contexts/Cart.context';

function PaymentOption({ orderID, email, username }: OrderId) {
  const container = useRef<HTMLDivElement>(null)
  const { clearCart } = useCart()

  const sendMessage = () => {
    clearCart()

    const phoneNumber = "9702456322";
    const message = encodeURIComponent(`Hello! I have successfully placed an order.Order ID: ${orderID}  Name: ${username}  Email: ${email} Please confirm the order status and share further details. Thank you!`);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(url, '_blank');
  }
  useEffect(() => {
    TriggerConfiti(container)
  }, [orderID, email])

  return (

    <>
      <div className='fixed top-0  w-full h-full pointer-events-none right-0 left-0  z-50 confetti' ref={container}></div>
      <section className='w-full  flex flex-col items-start justify-between  h-[300px] p-3 md:p-5   lg:p-10'>
        <div className='w-full relative h-[250px] flex-col flex items-center justify-start gap-1'>
          <h2 className='text-lg font-semibold text-green-800 text-center '>Thank you for your order at <strong>Markline</strong> </h2>
          <p className='text-base font-medium text-black text-center  '>To complete your order, please confirm it by sending us a message on <strong>WhatsApp</strong></p>
          <p className='text-base font-medium text-black text-center  '>We currently do not support online payment. Order confirmation via WhatsApp is required to proceed with shipping and delivery.</p>
        </div>
        <div className='relative h-auto flex  w-full items-center justify-center  px-10 gap-5'>
          <button className='w-fit relative h-auto px-5 py-2 text-white bg-black  cursor-pointer border border-transparent hover:border-black hover:text-black hover:bg-white  ' disabled={email || orderID ? false : true} onClick={sendMessage}>WhatsApp</button>
          {/* <button className='w-fit relative h-auto px-3 py-1 text-white bg-black cursor-pointer border border-transparent hover:border-black hover:text-black hover:bg-white  '>Buy iT</button>                 */}
        </div>
      </section>
    </>
  )
}

export default PaymentOption