"use client"

import Image from "next/image"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PencilRuler, Ruler } from "lucide-react"

export function SizeChartModal() {
    const [open, setOpen] = useState(false)

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-sm  text-[#128C7E] font-semibold flex items-center  gap-3">
                    View Size Chart

                </button>
            </DialogTrigger>

            <DialogContent className="max-w-[90vw] md:max-w-xl p-0">
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle className="flex items-center gap-6"> Size Chart

                        <PencilRuler size={25} className="text-gray-600" />
                    </DialogTitle>
                </DialogHeader>

                {/* Image Container */}
                <div className="w-full h-full overflow-auto p-4 max-h-[600px]  ">
                    <Image
                        src="/size-guide.png"   // change to your image path
                        alt="Size Chart"
                        width={800}
                        height={800}
                        className="w-full h-auto object-contain rounded-2xl"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
