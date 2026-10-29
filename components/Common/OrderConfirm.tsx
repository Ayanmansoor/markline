"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function OrderConfirmed() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  // Monitor localStorage for order confirmation
  useEffect(() => {
    const checkOrderConfirmation = () => {
      const orderConfirmed = localStorage.getItem("orderConfirmed")
      if (orderConfirmed === "true") {
        setIsOpen(true)
        // Clear the localStorage value
        localStorage.setItem("orderConfirmed", "false")
      }
    }

    // Check immediately
    // checkOrderConfirmation()

    // Listen for storage changes (in case it's set from another tab/component)
    window.addEventListener("storage", checkOrderConfirmation)

    // Also check periodically (for same-tab updates)
    const interval = setInterval(checkOrderConfirmation, 100)

    return () => {
      window.removeEventListener("storage", checkOrderConfirmation)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setShowMessage(false)
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setShowMessage(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[380px] p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-2xl text-center">
        <div className="flex flex-col items-center justify-center pt-2 pb-1 space-y-4">
          {/* Subtle compact confirmation badge - no big bouncing icons */}
          <div className="w-12 h-12 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-lg shadow-zinc-950/15">
            <Check className="w-5 h-5" strokeWidth={2.5} />
          </div>

          <div className="space-y-1.5">
            <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900">
              Order Confirmed
            </DialogTitle>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
              Thank you for your purchase. Your order has been placed and is being prepared for dispatch.
            </p>
          </div>

          <div className="w-full bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 text-xs flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Estimated Delivery</span>
            <span className="font-semibold text-zinc-900">3–5 Business Days</span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
