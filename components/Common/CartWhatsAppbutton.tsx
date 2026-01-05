import { newCartItem } from '@/Contexts/Cart.context';
import { CartItem } from '@/types/interfaces';
import React from 'react';

// Defining the shape of your cart data based on your JSON

interface WhatsAppCartButtonProps {
    cartItem: newCartItem;
}

const WhatsAppCartButton = ({ cartItem }: WhatsAppCartButtonProps) => {
    const adminPhoneNumber = "919769020660";

    const handleInquiry = () => {
        const { productName, quantity, slug, variant } = cartItem;

        // Construct the direct product URL
        const productUrl = `https://shopmarkline.in/product/${slug}`;

        // Calculate total for this specific item
        const totalAmount = variant.price * quantity;

        // Build a structured, professional order message
        const message = `
        *CART ENQUIRY*
        --------------------------
        *Product:* ${productName}
        *SKU:* ${variant.sku}
        *Size:* ${variant.selectedSize.size} (${variant.selectedSize.unit})
        *Color:* ${variant.selectedColor.name}
        *Quantity:* ${quantity}
        *Price per unit:* ₹${variant.price}
        *Total:* ₹${totalAmount}
        *View Product:*
        ${productUrl}`;
        const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            onClick={handleInquiry}
            className="flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-2 py-1.5 text-sm  font-bold rounded shadow transition-all active:scale-95"
        >
            <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
            >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.014 12.032c0 2.12.556 4.189 1.613 6.011L0 24l6.117-1.605a11.837 11.837 0 005.9 1.604h.005c6.638 0 12.034-5.396 12.038-12.032A11.785 11.785 0 0019.524 3.488z" />
            </svg>
            Order
        </button>
    );
};

export default WhatsAppCartButton;