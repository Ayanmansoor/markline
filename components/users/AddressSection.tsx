import React from 'react'
import AddressCard from './AddressCard'
import AddAdressSheet from './AddAdressSheet'
import { AddressProps } from '@/types/interfaces'

export interface addressprops {
  address: AddressProps[];
  handleperform?: (data?: any) => void;
}

function AddressSection({ address, handleperform }: addressprops) {
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8'>
      {address && address.map((add, index) => (
        <AddressCard {...add} key={add.id || index} index={index + 1} handleperform={handleperform} />
      ))}
    </div>
  )
}

export default AddressSection