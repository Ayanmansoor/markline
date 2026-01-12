export const getDiscountedPrice = (price, discountPercent) => {
    if (!discountPercent) return price;

    const discountedPrice = price - (price * discountPercent) / 100;
    return Math.round(discountedPrice); // 👈 use Math.round
};