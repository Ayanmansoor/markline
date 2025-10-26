"use client"

import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"

interface OrderStatus {
    id: string
    status: "processing" | "shipped" | "in-transit" | "delivered"
    date: string
}

interface Order {
    orderNumber: string
    date: string
    total: number
    status: "processing" | "shipped" | "in-transit" | "delivered"
    items: Array<{
        name: string
        quantity: number
        price: number
    }>
    timeline: OrderStatus[]
    estimatedDelivery: string
}



const statusColors: Record<string, string> = {
    processing: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    "in-transit": "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
}

const statusLabels: Record<string, string> = {
    processing: "Processing",
    shipped: "Shipped",
    "in-transit": "In Transit",
    delivered: "Delivered",
}

export default function page() {
    // const [orderNumber, setOrderNumber] = useState("")
    // const [order, setOrder] = useState<Order | null>(null)
    // const [error, setError] = useState("")
    // const [searched, setSearched] = useState(false)

    const order = ""
    const error = ""
    const searched = ""

    return (
        <main className="min-h-screen bg-background">
            {/* <div className="bg-primary text-primary-foreground py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
                    <p className="text-primary-foreground/80">
                        Enter your order number to see the latest status and delivery information
                    </p>
                </div>
            </div> */}

            {/* <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="p-6 mb-8">
                    <form className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Enter order number (e.g., ORD-001)"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" className="px-8">
                            Track Order
                        </Button>
                    </form>
                    {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
                </Card>

                {searched && order && (
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{order.orderNumber}</h2>
                                    <p className="text-muted-foreground">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full font-semibold ${statusColors[order.status]}`}>
                                    {statusLabels[order.status]}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Order Total</p>
                                    <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Estimated Delivery</p>
                                    <p className="text-xl font-bold">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold mb-6">Delivery Timeline</h3>
                            <div className="space-y-4">
                                {order.timeline.map((event, index) => (
                                    <div key={event.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-4 h-4 rounded-full ${statusColors[event.status]} border-2 border-current`} />
                                            {index < order.timeline.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-semibold">{statusLabels[event.status]}</p>
                                            <p className="text-muted-foreground text-sm">{new Date(event.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold mb-4">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6 bg-muted">
                            <h3 className="font-bold mb-2">Need Help?</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                If you have any questions about your order, please contact our customer support team.
                            </p>
                            <Button variant="outline" className="w-full bg-transparent">
                                Contact Support
                            </Button>
                        </Card>
                    </div>
                )}

                {searched && !order && !error && (
                    <Card className="p-12 text-center">
                        <p className="text-muted-foreground mb-4">No order found with that number.</p>
                        <p className="text-sm text-muted-foreground">Please check your order number and try again.</p>
                    </Card>
                )}
            </div> */}
        </main>
    )
}


