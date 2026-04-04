import React from 'react'
import { Colors, Images, Sizes } from '@/types/interfaces'

interface OrderProductRowProps {
    item: any;
}

export function OrderProductRow({ item }: OrderProductRowProps) {
    const color: Colors = typeof item.color === 'string' ? JSON.parse(item.color) : item.color
    const size: Sizes = typeof item.size === 'string' ? JSON.parse(item.size) : item.size
    const parsedImages: Images[] = Array.isArray(item.variant_id?.image_url)
        ? item.variant_id.image_url.map((img: any) => typeof img === 'string' ? JSON.parse(img) : img)
        : [];

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-gray-100 last:border-0 gap-6">
            <div className=" flex-col lg:flex-row flex items-center gap-6 flex-1">
                <div className=" w-full h-[150px] md:w-20 md:h-24 bg-gray-50 flex-shrink-0 overflow-hidden rounded-sm border border-gray-100">
                    <img
                        src={parsedImages?.[0]?.image_url || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-full h-full object-bottom md:object-center  object-cover transition-transform duration-500 hover:scale-110"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-black uppercase tracking-widest text-black">
                        {item.product?.name}
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1">
                            <span className="text-gray-300">Clr:</span> {color?.name}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-gray-300">Sz:</span> {size?.size} {size?.unit}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-fit md:justify-end gap-12">
                <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Qty</span>
                    <span className="text-xs font-black text-black">{item.quantity}</span>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Sum</span>
                    <span className="text-xs font-black text-black">₹{item.final_price}</span>
                </div>
            </div>
        </div>
    )
}
