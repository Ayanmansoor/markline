'use client';
import { CartVariant } from '@/types/interfaces';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

// --- Interfaces ---

export interface Colors {
  name: string;
  hex: string;
}

export interface Sizes {
  size: string;
  unit: string;
}

export interface Images {
  name: string;
  image_url: string;
}

export interface NewDiscountProps {
  discount_id: string;
  name: string;
  discount_persent: number;
  discount_start: string;
  discount_end: string;
}

// export interface CartVariant {
//   id: number;
//   sku: string;
//   price: number;
//   stock: number;
//   image_url: Images[];
//   is_active: boolean;
//   created_at: string;
//   products_id: number;
//   discount_key?: string;
//   discounts?: NewDiscountProps;
//   selectedColor: Colors;
//   selectedSize: Sizes;
// }

export interface newCartItem {
  productId: number;
  productName: string;
  slug: string;
  variant: CartVariant;
  quantity: number;
  url: string;
  gender: string;
}

// --- Context Interface ---

interface CartContextProps {
  cart: newCartItem[];
  addToCart: (item: newCartItem) => void;
  removeFromCart: ({ productId, colorName, size }: { productId: number, colorName: Colors | undefined, size: Sizes | undefined }) => void;
  updateQuantity: ({ productId, colorName, size, quantity }: { productId: number, colorName: Colors, size: Sizes, quantity: number }) => void;
  clearCart: () => void;
  isInCart: ({ variantId, colorName, size }: { variantId: number, colorName: string, size: string }) => boolean;
  getCartProduct: ({ variantId, colorName, size, }: { variantId: number; colorName: string; size: string; }) => newCartItem | undefined;
}

// --- Context Creation ---

const CartContext = createContext<CartContextProps | undefined>(undefined);

// --- Provider Component ---

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<newCartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   try {
  //     const storage = window.localStorage;
  //     if (storage) {
  //       const stored = storage.getItem('cart');
  //       if (stored) {
  //         setCart(JSON.parse(stored));
  //       }
  //     }
  //   } catch (error) {
  //     console.error('CartProvider: Failed to load cart from localStorage:', error);
  //   }
  //   setIsInitialized(true);
  // }, []);

  // Sync to localStorage
  // useEffect(() => {
  //   if (!isInitialized || typeof window === 'undefined') return;
  //   try {
  //     const storage = window.localStorage;
  //     if (storage) {
  //       storage.setItem('cart', JSON.stringify(cart));
  //     }
  //   } catch (error) {
  //     console.error('CartProvider: Failed to sync cart to localStorage:', error);
  //   }
  // }, [cart, isInitialized]);

  // Add item to cart
  const addToCart = (item: newCartItem) => {
    setCart((prev) => {
      const exists = prev.some(
        (i) =>
          i.variant?.id === item?.variant?.id &&
          i.variant?.selectedColor.name === item.variant?.selectedColor.name &&
          i.variant?.selectedSize.size === item.variant?.selectedSize.size
      );
      return exists ? prev : [...prev, item];
    });
  };

  // Remove item from cart
  const removeFromCart = ({ productId, colorName, size }: { productId: number, colorName: Colors | undefined, size: Sizes | undefined }) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.productId === productId &&
            i.variant?.selectedColor.name === colorName?.name &&
            i.variant?.selectedSize.size === size?.size
          )
      )
    );
  };

  // Alias

  // Update quantity
  const updateQuantity = ({
    productId,
    colorName,
    size,
    quantity, }: { productId: number, colorName: Colors | null, size: Sizes | null, quantity: number }) => {

    setCart((prev) =>
      prev.map((i) => {
        if (
          i.productId === productId &&
          i.variant?.selectedColor.name === colorName?.name &&
          i.variant?.selectedSize.size === size?.size
        ) {
          return { ...i, quantity };
        }
        return i;

      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Check if item exists in cart
  const isInCart = ({ variantId, colorName, size }: { variantId: number, colorName: string, size: string }) => {
    return cart.some(
      (i) =>
        i.variant.id === variantId &&
        i.variant.selectedColor.name === colorName &&
        i.variant.selectedSize.size === size
    );
  };

  // Get item from cart
  function getCartProduct({
    variantId,
    colorName,
    size,
  }: {
    variantId: number;
    colorName: string;
    size: string;
  }) {
    return cart.find(
      (item) =>
        item.variant.id === variantId &&
        item.variant.selectedColor.name === colorName &&
        item.variant.selectedSize.size === size
    );
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- Hook ---

export const useCartContext = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
