// import axios from "axios";
// interface OrderFormData {
//   final_price: number;
//   quantity: number;
//   discount_amount: number;
//   product_key: number;
//   email: string;
//   name: string;
//   phone?: string;
//   pin_code?: string;
//   state_name?: string;
//   city?: string;
//   full_address?: string;
//   recaptchaToken?: string;
// }
// interface FormResult {
//   message: string;
//   code: number;
//   isOrder: boolean;
//   data?: any;
// }
// interface OrderResponse {
//   message: string;
//   order: any;
//   email: string;
// }

// async function acceptOrderForm(formData: OrderFormData): Promise<FormResult> {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       pin_code,
//       state_name,
//       city,
//       full_address,
//       final_price,
//       quantity,
//       discount_amount,
//       product_key,
//       recaptchaToken,
//     } = formData;


//     const response = await axios.post<OrderResponse>(
//       "https://qmtfmhylybgxvvihpaxw.supabase.co/functions/v1/confirm-order",
//       {
//         name,
//         email,
//         phone,
//         pin_code,
//         state_name,
//         city,
//         full_address,
//         final_price,
//         quantity,
//         discount_amount,
//         product_key,
//         recaptchaToken,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_ANON_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return {
//       message: response.data.message,
//       code: 200,
//       isOrder: true,
//       data: response.data.order,
//     };
//   } catch (error: any) {
//     console.error("Order submission failed:", error?.response?.data || error.message);
//     return {
//       message: error?.response?.data?.error || "Something went wrong.",
//       code: error?.response?.status || 500,
//       isOrder: false,
//     };
//   }
// }



// export { acceptOrderForm };

import axios from "axios";

interface OrderFormData {
  final_price: number;
  quantity: number;
  discount_amount: number;
  product_key: number;
  email: string;
  name: string;
  phone?: string;
  pin_code?: string;
  state_name?: string;
  city?: string;
  full_address?: string;
  recaptchaToken?: string;
}

interface FormResult {
  message: string;
  code: number;
  isOrder: boolean;
  data?: any;
}

async function submitOrders(orderArray: OrderFormData[]): Promise<FormResult> {
  try {
    const response = await axios.post(
      "https://qmtfmhylybgxvvihpaxw.supabase.co/functions/v1/confirm-order",
      orderArray, // ✅ Send array here
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      message: response.data.message,
      code: 200,
      isOrder: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Order submission failed:", error?.response?.data || error.message);
    return {
      message: error?.response?.data?.error || "Something went wrong.",
      code: error?.response?.status || 500,
      isOrder: false,
    };
  }
}

export { submitOrders };
