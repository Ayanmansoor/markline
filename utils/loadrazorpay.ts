export default function LoadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/magic-checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
