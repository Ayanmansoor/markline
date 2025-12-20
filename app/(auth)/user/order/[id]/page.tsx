'use client'
import CategoriesSection from "@/components/Common/CategoriesSection"
import OrderDetails from "@/components/Common/OrderDetailsinvioce"
import ProductCard from "@/components/Common/ProductCard"
import CarouselProduct from "@/components/Product/CarouselProduct"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllTrendingProducts, getCurrentUserOrders, getCurrentUserSingleOrder } from "@/Supabase/SupabaseApi"
import { mysupabase } from "@/Supabase/SupabaseConfig"
import { Colors, Images, Sizes } from "@/types/interfaces"
import { CheckCircle, MapPin, Truck } from "lucide-react"
import Link from "next/link"
import { redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

function formatDate(isoString) {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };


    return date.toLocaleString('en-US', options);
}




export default function OrderPage() {
    const { id } = useParams()
    const orderid = Array.isArray(id) ? id[0] : id;


    const [perform, setPerfom] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [address, setAddress] = useState<any[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getSupabaseUser() {
            setLoading(true);
            setError(null);

            try {
                const {
                    data: { user },
                    error: userError,
                } = await mysupabase.auth.getUser();

                if (userError) throw userError;

                if (user) {
                    const { orders }: any = await getCurrentUserSingleOrder(user.id, orderid);

                    console.log(orders, 'this is order id',)
                    setOrders(orders);
                    setAddress(orders?.address_id);
                }


            } catch (err: any) {
                console.error("Error fetching order:", err);
                setError("Failed to load order. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        getSupabaseUser();
    }, [perform]);

    const { data: trending, isLoading: trendingloading, isError: trendingerror } = useQuery<any>({
        queryKey: ["trendingproducts"],
        queryFn: getAllTrendingProducts,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const getStepStatus = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return [true, true, true];
            case "SHIPPED":
                return [true, true, false];
            case "PENDING":
            default:
                return [true, false, false];
        }
    };

    if (loading) {
        return (
            <section className='w-full relative bg-white flex items-center justify-center h-[80vh]'>
                <div className='w-fit relative h-fit flex flex-col items-center justify-center gap-0'>
                    <h2 className='text-p40 text-primary font-semibold italic uppercase'>Markline</h2>
                    <p className='text-bse font-medium text-primary self-end justify-self-end leading-[.1]'>Mark Your Way.</p>
                </div>
            </section>
        );
    }
    if (error) {
        redirect('/user')
    }

    return (
        <div className=" flex flex-col gap-0 py-8 px-4  min-h-[100vh]">
            <div className="px-5 lg:px-10 xl:px-20 2xl:px-40 w-full grid  grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 mx-auto">

                <Card className="border h-full border-gray-200 shadow-sm ">
                    <CardContent className=" p-3 md:p-6 ">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-3 left-6 right-6 h-0.5 bg-gray-200 z-0" />
                            <div className="absolute top-3 left-6 right-6 h-0.5 bg-blue-500 z-0" style={{
                                width: (() => {
                                    const [ordered, shipped, delivered] = getStepStatus(orders[0]?.isDelivered);
                                    if (delivered) return "100%";
                                    if (shipped) return "66%";
                                    return "33%";
                                })()
                            }} />

                            {["Ordered", "Shipped", "Delivered"].map((step, i) => {
                                const [ordered, shipped, delivered] = getStepStatus(orders[0]?.isDelivered);
                                const statusList = [ordered, shipped, delivered];
                                const isComplete = statusList[i];

                                return (
                                    <div key={i} className="flex flex-col items-center relative z-10">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center ${isComplete ? "bg-blue-500" : "bg-gray-300"
                                                }`}
                                        >
                                            {isComplete && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <div className={`text-sm font-medium ${isComplete ? "text-gray-900" : "text-gray-500"}`}>
                                                {step}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {
                            orders.map((item, index) => {
                                // console.log(JSON.parse(item.color), JSON.parse(item.size))
                                const color: Colors = JSON.parse(item.color)
                                const size: Sizes = JSON.parse(item.size)
                                const parsedImages: Images[] = Array.isArray(item.variant_id.image_url)
                                    ? item.variant_id.image_url.map((item: string) => JSON.parse(item))
                                    : [];
                                return (
                                    <Link href="/" className=" flex-col md:flex-row flex items-start gap-4 mb-6 border border-gray-300  p-4 rounded-md  shadow-sm   mt-8" key={index}>
                                        <img
                                            src={parsedImages?.[0]?.image_url || "/placeholder.svg"}
                                            alt={item.product.name}
                                            height={500}
                                            width={500}
                                            className="w-24 h-24 object-cove0r border border-gray-300 rounded-lg bg-white"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-primary text-sm md:text-base mb-1">{item?.product?.name}</h3>
                                            <div className="text-sm text-primary mt-1 w-full relative md:w-fit flex items-start justify-between md:justify-start gap-3">
                                                <span className="flex flex-col gap-1">
                                                    <div className="text-primary text-sm font-medium">Color :</div>
                                                    <div className="text-xs font-medium">{color.name}</div>
                                                </span>
                                                <span className="flex flex-col gap-1">
                                                    <div className="text-primary text-sm font-medium">Size :</div>
                                                    <div className="text-sm font-medium">{size.size} {size.unit}</div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-row justify-between w-full md:w-fit md:justify-start md:flex-col ">
                                            <div className="font-medium text-primary">${item?.final_price}</div>
                                            <div className="text-sm text-primary mt-1">Quantity: {item?.quantity}</div>
                                        </div>
                                    </Link>
                                )
                            })
                        }

                    </CardContent>
                </Card>

                <Card className="border h-full border-gray-200 shadow-sm">
                    <CardContent className=" p-4 md:p-6">
                        {
                            orders.map((item, index) => (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" key={index}>
                                    {/* Left column */}
                                    <div className="space-y-6">
                                        <div>
                                            {/* order created */}
                                            <h4 className="font-medium text-primary mb-2">Ordered</h4>
                                            <p className="text-sm text-primary">{formatDate(item?.created_at)}</p>
                                        </div>

                                        {/* <div>
                                    <h4 className="font-medium text-primary mb-2">Ordered from</h4>
                                    <div className="text-sm text-primary whitespace-pre-line">
                                        {orderData.orderDetails.orderedFrom.company}
                                        {"\n"}
                                        {orderData.orderDetails.orderedFrom.address}
                                    </div>
                                </div> */}

                                        <div>
                                            <h4 className="font-medium text-primary mb-2">Payment method</h4>
                                            <p className="text-sm text-primary">Online</p>
                                        </div>
                                    </div>

                                    {/* Right column */}
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-medium text-primary mb-2">Order number</h4>
                                            <p className="text-sm text-blue-600 underline cursor-pointer">{item.id}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-primary mb-2">Shipping address</h4>
                                            <div className="text-sm text-primary whitespace-pre-line">
                                                {item?.address_id?.name}
                                                {"\n"}
                                                {item?.address_id?.full_address}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-primary">Shipping</span>
                                                <span className="text-green-400 font-medium text-base ">Free</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-primary ">Discount</span>
                                                <span className="text-green-400 font-medium text-base">-₹{item.discount_amount}</span>
                                            </div>
                                            {/* <div className="flex justify-between text-sm">
                                                <span className="text-primary">Tax</span>
                                                <span className="text-gray-900">${orderData.pricing.tax.toFixed(2)}</span>
                                            </div> */}
                                            <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                                                <span className="text-gray-900">Total</span>
                                                <span className="text-gray-900">₹{item.final_price}</span>
                                            </div>
                                        </div>

                                        <OrderDetails order={item} />

                                    </div>
                                </div>
                            ))
                        }
                    </CardContent>
                </Card>


            </div>

            {
                trending.length > 0 &&
                <CategoriesSection title={"Top Deal On These Products "} url='' >
                    <div className={` w-full   h-auto grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 bg-gray-200  bg-secondary   `}>
                        {trending?.map((product, index: number) => (
                            <ProductCard url='product' key={index} product={product.product} className={" h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]"} />
                        ))}
                    </div>
                </CategoriesSection>
            }




        </div>
    )
}
