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
    checkOrderConfirmation()

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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Order Confirmation</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8">
            {!showMessage ? (
              <div className="relative">
                {/* Checkmark with animation */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <Check className="w-10 h-10 text-green-600 animate-bounce" strokeWidth={3} />
                </div>

                {/* Ripple effect */}
                <div className="absolute inset-0 w-20 h-20 bg-green-200 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 w-16 h-16 bg-green-300 rounded-full animate-ping opacity-30 animation-delay-75"></div>
              </div>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-700">Order Confirmed!</h3>
                  <p className="text-sm text-muted-foreground">
                    Thank you for your purchase. Your order has been successfully placed and will be processed shortly.
                  </p>
                  <p className="text-xs text-muted-foreground"> Estimated delivery: 3-5 business days</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
 
  )
}
