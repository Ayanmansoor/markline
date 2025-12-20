import { addressprops } from "@/components/users/AddressSection";
import { AddressProps } from "@/types/interfaces";
import axios from "axios";

interface ProductData {
  name: string;
  city: string;
  full_address: string;
  product_key: {
    name: string
  };
  final_price: number;
  discount_amount: number;
  quantity: number;
  orderId?: string
  email: string;
  phone: string;
  state_name: string;
  pin_code: string;
  id: string;
  products: {
    name: string;
  };
}

type PropsData = {
  data: ProductData[];
  user: any,
  address: AddressProps | null
};

export default async function SendMail({ data, user, address }: PropsData) {
  try {

    console.log(data, user, 'this is user data i have ')


    if (!data) {
      throw new Error("No data provided");
    }


    const firstItem = data[0];

    const productNames = data.map((item) => item.product_key.name);
    const quantities = data.map((item) => item.quantity);

    const emailResponse: any = await axios.post("/api/sendmail", {
      email: user?.user_metadata?.email || "email",
      name: user?.user_metadata?.name || "User",
      phone: user?.user_metadata?.phone || "number",
      orderId: firstItem.id,
      productNames,
      quantity: quantities,
      address: address?.full_address,
      city: address?.city,
      state: address?.state_name,
      pin: address?.pin_code,
      finalPrice: data.reduce((acc, curr) => acc + curr.final_price, 0),
    });


    return emailResponse;
  } catch (error) {
    console.log("SendMail error:",);
    return new Error("Failed to send mail.");
  }
}
