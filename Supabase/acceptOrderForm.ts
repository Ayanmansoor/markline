import axios from "axios";

async function acceptOrderForm(formData: {
  final_price: any;
  quentity: any;
  discount_amount: any;
  product_key: any;
  email: any;
  name: any;
  phone?: any;
  pin_code?: any;
  state_name?: any;
  city?: any;
  full_address?: any;
  recaptchaToken?: any;
}) {
  try {
    const {
      name,
      email,
      phone,
      pin_code,
      state_name,
      city,
      full_address,
      final_price,
      quentity,
      discount_amount,
      product_key,
      recaptchaToken,
    } = formData;

    const reponse: any = await axios.post(
      "https://qmtfmhylybgxvvihpaxw.supabase.co/functions/v1/confirm-order",
      {
        name,
        email,
        phone,
        pin_code,
        state_name,
        city,
        full_address,
        final_price,
        quentity,
        discount_amount,
        product_key,
        recaptchaToken,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ANON_KEY}`,
        },
      }
    );

    return {
      message: reponse?.message,
      code: 200,
      isOrder: true,
      data: reponse?.order,
    };
  } catch (error: any) {
    console.log("error", error);
    return new Error(error?.message || "Something went wrong.");
  }
}

export { acceptOrderForm };
