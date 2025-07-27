import axios from "axios";

interface ProductData {
  name: string;
  city: string;
  full_address: string;
  product_key:{
    name:string 
  };
  final_price: number;
  discount_amount: number;
  quantity: number;
  orderId?:string
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
};

export default async function SendMail({ data }: PropsData) {
  try {

    if (!data) {
      throw new Error("No data provided");
    }


    const firstItem = data[0];

    const productNames = data.map((item) => item.product_key.name);
    const quantities = data.map((item) => item.quantity);

    const emailResponse: any = await axios.post("/api/sendmail", {
      email: firstItem.email,
      name: firstItem.name,
      phone: firstItem.phone,
      orderId: firstItem.id,
      productNames,
      quantity: quantities,
      address: firstItem.full_address,
      city: firstItem.city,
      state: firstItem.state_name,
      pin: firstItem.pin_code,
      finalPrice: data.reduce((acc, curr) => acc + curr.final_price, 0),
    });


    return emailResponse;
  } catch (error) {
    console.log("SendMail error:",);
    return new Error("Failed to send mail.");
  }
}
