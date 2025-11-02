'use client'
import * as React from "react"
import axios from "axios"
import { useEffect ,useState} from "react"

import { CityComboboxProps } from "@/types/interfaces"

export function CityNameCombobox({setCityName,errormessage,statename,selectcity}:CityComboboxProps) {
  const [Cities,setCities]=useState<string[]>([])
  

  async function getCityName(statename:string){
    if(statename){
    const res=await axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities` , {
      country:"India",
      state:statename
    })
    setCities(res.data.data)
  }
  }

  useEffect(()=>{
    getCityName(statename)
  },[statename])


  function cityname (event: { target: { value: string } }) {
      setCityName(event.target.value)
  }

  return (
        <>
                 <div className='w-full relative h-auto flex flex-col gap-1  '>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>City Name *</label>
                    <select  value={selectcity || ""} className="wnd-full text-sm font-normal text-gray-500 relative h-auto py-[7px] border border-gray-200 px-2 rounded-lg" onChange={cityname}>
                        <option  className="text-base text-gray-200 rounded-md" selected>Select Your City</option>
                        {
                          Cities.map((city,index)=>(
                            <option value={`${city}`} className="text-base text-primary rounded-md" key={index}>{city}</option>
                          ))
                        }
                    </select>
                    {errormessage&&
                        <p className='text-xs font-medium text-red-400'>{errormessage}</p>}
                </div>
        </>
  )
}
