import React from 'react'
import { SlOptionsVertical } from "react-icons/sl";
import { AddressProps } from '@/types/interfaces'
import UpdateAddress from './UpdateAddress';
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios';
import { toast } from 'sonner';

function AddressCard({state_name,city,pin_code,name,full_address,index,id,user_id,is_selected,created_at,handleperform}:AddressProps) {

  async function deleteAddress() {
    try{
        const reponse=await axios.post('/api/delete-address',{
          user_id,
          id
        })
        console.log(reponse)
        toast("Address Deleted Successfully")   
        handleperform&&handleperform()
    }
    catch(error){
    toast("Something Strength Happend try agin later.")   
      console.log(error ,"this error get ")
    }
  }

  return (
    <section className={`flex flex-col gap-2 border border-white rounded-lg  p-4 ${is_selected? "bg-white": "bg-gray-200"}  `}>
      <div className='w-full relative h-auto flex items-center  border-gray-300  border-b justify-between'>
          <h2  className='text-sm font-semibold text-primary  pb-2 w-full flex items-center justify-between'>Address {index}
          </h2>
          <span className='w-fit relative h-auto flex items-center gap-2'>
              <MdDeleteOutline className='text-[20px] text-red-400 cursor-pointer' onClick={deleteAddress}/>
                <UpdateAddress currentaddress={{
                    state_name,
                    city,
                    pin_code,
                    name,
                    full_address,
                    user_id,
                    is_selected,
                    created_at,
                    id
                  }
                  }>
                    <SlOptionsVertical className='text-[15px] text-primary cursor-pointer' />
                  </UpdateAddress>
            </span>
        </div>

          <ul className='w-full relative h-auto flex flex-col gap-1'>
            <li className=' text-xs sm:text-sm font-semibold text-priamry grid grid-cols-2 md:grid-cols-[.5fr_1fr] items-center gap-10 '>
              name : <p className='font-medium  text-xs sm:text-sm '>
                {name}
              </p>
            </li>
             <li className=' text-xs sm:text-sm  font-semibold text-priamry  grid grid-cols-2 md:grid-cols-[.5fr_1fr] items-center gap-10'>
              city : <p className='font-medium text-xs sm:text-sm '>
                {city}
              </p>
            </li>
             <li className=' text-xs sm:text-sm  font-semibold text-priamry grid grid-cols-2 md:grid-cols-[.5fr_1fr] items-center gap-10'>
              state : <p className='font-medium  text-xs sm:text-sm '>
                {state_name}
              </p>
              
            </li>
             <li className=' text-xs sm:text-sm  font-semibold text-priamry grid grid-cols-2 md:grid-cols-[.5fr_1fr] items-center gap-10 '>
              pincode : <p className='font-medium  text-xs sm:text-sm '>
                {pin_code}
              </p>  
            </li>
            <li className=' text-xs sm:text-sm  font-semibold text-priamry  grid grid-cols-2 md:grid-cols-[.5fr_1fr] items-center gap-10'>
              full address : <p className='font-medium  text-xs sm:text-sm  line-clamp-2'>
                {full_address}
              </p>  
            </li>
            

          </ul>

    </section>
  )
}

export default AddressCard