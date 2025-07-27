import React from 'react'
import AddressCard from './AddressCard'
import AddAdressSheet from './AddAdressSheet'
import { AddressProps } from '@/types/interfaces'

export interface addressprops{
  address:AddressProps[]
  handleperform:()=>void

}
function AddressSection({address,handleperform}:addressprops) {


  return (
    <section className='flex flex-col gap-5 p-4'>
        <AddAdressSheet handleperform={handleperform}>
            <button className='justify-self-end px-10 w-fit  py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-primary'>
              Add Address
            </button>
        </AddAdressSheet>
        <section className=' w-full relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 '>
          {
            address &&
            address.map((add,index)=>(
              <AddressCard id={add.id} user_id={add.user_id} name={add.name} state_name={add.state_name} city={add.city} pin_code={add.pin_code} full_address={add.full_address} is_selected={add.is_selected} created_at={add.created_at} key={index} index={index+1}/>
            ))
          }
        </section>
    </section>
  )
}

export default AddressSection