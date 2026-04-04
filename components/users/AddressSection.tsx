import React from 'react'
import AddressCard from './AddressCard'
import AddAdressSheet from './AddAdressSheet'
import { AddressProps } from '@/types/interfaces'

export interface addressprops {
  address: AddressProps[]

}
function AddressSection({ address }: addressprops) {
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8'>
      {address && address.map((add, index) => (
        <AddressCard {...add} key={index} index={index + 1} />
      ))}
    </div>
  )
}

export default AddressSection