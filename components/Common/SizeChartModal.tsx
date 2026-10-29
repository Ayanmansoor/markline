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
                <button type="button" className="text-xs font-medium text-zinc-600 hover:text-zinc-950 underline underline-offset-4 flex items-center gap-1.5 transition-colors">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Size Chart</span>
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-[90vw] md:max-w-xl p-0 overflow-hidden rounded-2xl border border-zinc-200/80 shadow-2xl bg-white">
                <DialogHeader className="p-5 pb-3 border-b border-zinc-100 text-left">
                    <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        <span>Size Chart</span>
                        <PencilRuler size={16} className="text-zinc-400" />
                    </DialogTitle>
                </DialogHeader>

                {/* Image Container */}
                <div className="w-full h-full overflow-auto p-5 max-h-[580px] flex items-center justify-center bg-zinc-50/40">
                    <Image
                        src="/size-guide.png"
                        alt="Size Chart"
                        width={800}
                        height={800}
                        className="w-full h-auto object-contain rounded-xl"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
