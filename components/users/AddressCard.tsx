import React from 'react'
import { SlOptionsVertical } from "react-icons/sl";
import { AddressProps } from '@/types/interfaces'
import UpdateAddress from './UpdateAddress';
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios';
import { toast } from 'sonner';

function AddressCard({ state_name, city, pin_code, name, full_address, index, id, user_id, is_selected, created_at, handleperform, landmark, recipientName, recipientPhone }: AddressProps) {


  async function deleteAddress() {
    try {
      const response = await axios.post('/api/delete-address', { user_id, id })
      toast.success("Address Removed from Registry")
      handleperform && handleperform()
    } catch (error) {
      toast.error("Failed to remove address. Try again later.")
    }
  }

  return (
    <div className={`group flex flex-col gap-6 p-6 rounded-2xl border transition-all duration-300 ${is_selected ? "bg-gray-200 text-black border-gray-300 shadow-2xl shadow-black/10" : "bg-white text-black border-gray-100 hover:border-black/10 hover:shadow-xl hover:shadow-gray-200/50"}`}>

      {/* Header */}
      <div className='flex items-center justify-between border-b pb-4 border-current '>
        <div className='flex items-center gap-3'>
          <span className=' text-[10px] sm:text-xs  md:text-sm text-primary font-bold uppercase '>Registration No.</span>
          <span className='text-[10px] sm:text-xs  md:text-sm font-primary '>{index?.toString().padStart(2, '0')}</span>
        </div>
        <div className='flex items-center gap-4'>
          <MdDeleteOutline
            className={`text-xl cursor-pointer transition-colors  ${is_selected ? 'hover:text-red-400' : 'text-red-500 hover:text-red-500'}`}
            onClick={deleteAddress}
          />
          <UpdateAddress
            handleperform={handleperform}
            currentaddress={{ state_name, city, pin_code, name, full_address, user_id, is_selected, id, landmark, recipientName, recipientPhone }}
          >
            <div className={`p-2 rounded-lg cursor-pointer transition-all ${is_selected ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-50 hover:bg-black hover:text-white'}`}>
              <SlOptionsVertical size={12} />
            </div>
          </UpdateAddress>
        </div>
      </div>

      {/* Body */}
      <div className='space-y-6'>
        <div className='flex flex-col gap-1'>
          <span className='text-[9px] font-black uppercase tracking-[0.3em] '>Authorized Recipient</span>
          <h4 className='text-sm font-black uppercase tracking-tight italic'>{recipientName || name}</h4>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='text-[9px] font-black uppercase tracking-[0.3em] '>Postal Designation</span>
          <p className='text-xs font-bold leading-relaxed opacity-80 uppercase line-clamp-3'>
            {full_address}, {landmark && `${landmark},`} {city}, {state_name} - {pin_code}
          </p>
        </div>
      </div>

      {/* Footer / Status */}
      {is_selected && (
        <div className='mt-auto pt-4 flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-yellow-600 animate-pulse' />
          <span className='text-xs font-black uppercase tracking-widest text-yellow-600'>Primary Jurisdiction</span>
        </div>
      )}
    </div>
  )
}

export default AddressCard