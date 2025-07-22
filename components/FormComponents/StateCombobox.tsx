"use client"

    import * as React from "react"
    import { useEffect ,useState} from "react"
    import axios from "axios"
    import { StateComboboxProps, States , } from "@/types/interfaces"

    export function StateCombobox({setStateValue,errormessage}:StateComboboxProps) {
        
    const [States,setState]=useState<States[]>([])


        async function getState() {

            const res=await axios.post(`https://countriesnow.space/api/v0.1/countries/states`,{
                    country:"India"
            })
            setState(res.data.data.states)
            // console.log(res.data.data.states,"this is value ")
        }
        useEffect(()=>{
        
            getState()
        },[])

        function selectStateName(event: { target: { value: React.SetStateAction<string> } }){
            setStateValue(`${event.target.value}`)
            // setValue(event.target.value)
        }


    return (
            <>
                    <div className='w-full relative h-auto flex flex-col gap-1  '>
                        <label htmlFor="" className='text-sm font-medium text-gray-600'>State Name *</label>
                        <select  className="w-full text-sm font-normal text-gray-500 relative h-auto py-[7px] border border-gray-200 px-2 rounded-lg" onChange={selectStateName} >                                    
                            <option value="volvo" className="text-base text-gray-200 rounded-md" selected>Select Your State</option>
                            {
                               States && States.map((state,index)=>(
                                    <option value={`${state.name}`} className="text-base text-black rounded-md" key={state.state_code}>{state.name}</option>
                                ))
                            }
                        </select>
                        {errormessage&&
                        <p className='text-xs font-medium text-red-400'>{errormessage}</p>}
                    </div>
            </>
    )
    }
