export interface PricingResult {
  mrp: number;
  retailPrice: number;
  baseDiscount: number;
  baseDiscountPercent: number;
  promoDiscount: number;
  finalPrice: number;
  totalSavings: number;
  totalSavingsPercent: number;
}

export interface OrderTotals {
  totalMrp: number;
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
}

/**
 * Checks if a promotional discount is currently active based on its start/end dates.
 */
export function isPromoActive(discount: any): boolean {
  if (!discount) return false;
  const now = new Date();
  
  // Format dates: handle discount_start/discount_end or starts_at/expires_at
  const start = discount.discount_start || discount.starts_at;
  const end = discount.discount_end || discount.expires_at;

  if (start && new Date(start) > now) {
    return false;
  }
  if (end && new Date(end) < now) {
    return false;
  }
  return true;
}

/**
 * Calculates pricing details for a single variant based on its MRP, Retail Price, and active promotional discount.
 */
export function calculateVariantPrice(variant: any, discount: any): PricingResult {
  const mrp = Number(variant.mrp || 0);
  const retailPrice = Number(variant.retail_price || variant.price || 0);

  // Base Discount: Difference between MRP and normal selling price
  const baseDiscount = Math.max(0, mrp - retailPrice);
  const baseDiscountPercent = mrp > 0 ? (baseDiscount / mrp) * 100 : 0;

  // Additional Promotional Discount (applied on top of the retail price)
  let promoDiscount = 0;
  if (discount && isPromoActive(discount)) {
    // If the promo discount has an inPercent boolean flag
    const inPercent = discount.inPercent !== undefined ? discount.inPercent : (discount.discount_type === 'PERCENTAGE' || discount.discount_type === 'PERCENT');
    const discountVal = Number(discount.discount_persent || discount.discount_value || 0);

    if (inPercent) {
      promoDiscount = retailPrice * (discountVal / 100);
    } else {
      promoDiscount = discountVal;
    }

    // Limit promotional discount to the retail price (price cannot be less than 0)
    promoDiscount = Math.min(promoDiscount, retailPrice);
  }

  // Final Product price per unit
  const finalPrice = Math.max(0, retailPrice - promoDiscount);
  const totalSavings = Math.max(0, mrp - finalPrice);
  const totalSavingsPercent = mrp > 0 ? (totalSavings / mrp) * 100 : 0;

  return {
    mrp,
    retailPrice,
    baseDiscount,
    baseDiscountPercent,
    promoDiscount,
    finalPrice,
    totalSavings,
    totalSavingsPercent
  };
}

/**
 * Calculates the overall order totals based on items in the cart and any applied coupons.
 */
export function calculateOrderTotals(cartItems: any[], appliedCoupon: any | null): OrderTotals {
  let totalMrp = 0;
  let subtotal = 0;
  let productDiscount = 0;

  const processedItems = cartItems.map(item => {
    const variant = item.variant;
    // Retrieve promo attached either inside variant or in item
    const discount = variant?.discounts || variant?.discount || item.discounts || item.discount;
    const qty = Number(item.quantity || 1);

    const priceDetails = calculateVariantPrice(variant || item, discount);

    totalMrp += priceDetails.mrp * qty;
    subtotal += priceDetails.finalPrice * qty;
    productDiscount += (priceDetails.baseDiscount + priceDetails.promoDiscount) * qty;

    return {
      ...item,
      priceDetails
    };
  });

  // Calculate Coupon Discount: Applied AFTER variant promotional discounts
  let couponDiscount = 0;
  if (appliedCoupon) {
    const couponVal = Number(appliedCoupon.discount_value || appliedCoupon.discountAmount || 0);
    const type = String(appliedCoupon.discount_type || '').toUpperCase();
    const isPercent = type === 'PERCENTAGE' || type === 'PERCENT';

    if (isPercent) {
      couponDiscount = subtotal * (couponVal / 100);
      const maxDiscount = Number(appliedCoupon.maximum_discount_amount || 0);
      if (maxDiscount > 0 && couponDiscount > maxDiscount) {
        couponDiscount = maxDiscount;
      }
    } else {
      couponDiscount = couponVal;
    }

    // Coupon discount cannot exceed subtotal
    couponDiscount = Math.min(couponDiscount, subtotal);
  }

  const shipping = 0; // Standard free shipping
  const tax = 0; // Taxes included in retail price
  const grandTotal = Math.max(0, subtotal - couponDiscount);

  return {
    totalMrp,
    subtotal, // This is order subtotal (sum of unit final prices before coupon)
    productDiscount,
    couponDiscount,
    shipping,
    tax,
    grandTotal
  };
}
