'use client'

import { CartItem, Colors, Sizes, updateQuantityProps } from "@/types/interfaces";
import { createContext, useContext, useEffect, useState } from "react";

// import React, {
//     createContext,
//     useState,
//     useEffect,
//     useContext,
//     ReactNode
// } from 'react';

// import { ProductsProps, Colors, Sizes, CartProductsProps } from '@/types/interfaces';

// // Define CartItem based on ProductsProps + selected color/size/quantity
// interface CartItem extends CartProductsProps {
//     selectedcolors: {
//         name: string,
//         hex: string
//     };
//     selectedsizes: {
//         size: string,
//         hex?: string
//     }
//     ,
//     quantity: number;
// }



// // Context type
// interface CartContextType {
//     cart: CartItem[];
//     addToCart: (product: any) => void;
//     deleteFromCart: (productId: number, color: Colors, size: Sizes) => void;
//     clearCart: () => void;
//     isInCart: (productId: number, color: Colors, size: Sizes) => boolean;
//     updateQuantity: (
//         productId: number,
//         newQuantity: number,
//         color: Colors,
//         size: Sizes
//     ) => void;
//     getCartProduct: (productId: number | string,) => CartItem | undefined;
// }

// // Create context
// const CartContext = createContext<CartContextType | undefined>(undefined);

// interface CartProviderProps {
//     children: ReactNode;
// }

// const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
//     const [cart, setCart] = useState<CartItem[]>(() => {
//         const savedCart = localStorage.getItem('cart');
//         return savedCart ? JSON.parse(savedCart) : [];
//     });

//     useEffect(() => {
//         if (cart.length > 0) {
//             localStorage.setItem('cart', JSON.stringify(cart));
//         } else {
//             localStorage.removeItem('cart');
//         }
//     }, [cart]);

//     const addToCart = (product: any) => {
//         console.log(product,"kjdlfjsldf")
//         setCart((prevCart) => {
//             const exists = prevCart.some(item =>
//                 item.id === product.id &&
//                 item.selectedcolors.name === product.selectedColor.name &&
//                 item.selectedsizes.size === product.selectedSize.size
//             );
//             if (exists) return prevCart;
//             return [...prevCart, product];
//         });
//     };

//     const updateQuantity = (
//         productId: number,
//         newQuantity: number,
//         color: Colors,
//         size: Sizes
//     ) => {
//         console.log(productId, newQuantity, color, size, "sdlfjsdlfj")
//         setCart((prevCart) => {
//             const index = prevCart.findIndex(
//                 item =>
//                     item.id === productId &&
//                     item.selectedColor.name === color.name &&
//                     item.selectedSize.size === size.size
//             );

//             if (index !== -1) {
//                 const updatedCart = [...prevCart];
//                 if (newQuantity === 0) {
//                     updatedCart.splice(index, 1);
//                 } else {
//                     updatedCart[index].quantity = newQuantity;
//                 }
//                 return updatedCart;
//             }
//             return prevCart;
//         });
//     };

//     const isInCart = (productId: number, color: Colors, size: Sizes) => {
//         return cart.some(item =>
//             item.id === productId &&
//             item.selectedColor.name === color.name &&
//             item.selectedSize.size === size.size
//         );
//     };

//     const deleteFromCart = (productId: number, color: Colors, size: Sizes) => {
//         setCart(prevCart =>
//             prevCart.filter(item =>
//                 !(item.id === productId &&
//                     item.selectedColor.name === color.name &&
//                     item.selectedSize.size === size.size)
//             )
//         );
//     };

//     const clearCart = () => {
//         setCart([]);
//     };

//     const getCartProduct = (productId: number,): CartItem | undefined => {
//         return cart.find(item =>
//             item.id === productId
//         );
//     };

//     return (
//         <CartContext.Provider
//             value={{
//                 cart,
//                 addToCart,
//                 deleteFromCart,
//                 clearCart,
//                 isInCart,
//                 updateQuantity,
//                 getCartProduct
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// };

// const useCart = (): CartContextType => {
//     const context = useContext(CartContext);
//     if (!context) {
//         throw new Error('useCart must be used within a CartProvider');
//     }
//     return context;
// };

// export { CartProvider, useCart };

interface providertype {
    children: React.ReactNode
}

interface hereCartitem {
    data: CartItem
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: hereCartitem) => void;
    deleteFromCart: (productId: number, color: string, size: string) => void;
    clearCart: () => void;
    isInCart: (productId: number, color: Colors, size: Sizes) => boolean;
    updateQuantity: ({ productId, quantity, color, size }: updateQuantityProps) => void;
    getCartProduct: (productId?: number | string) => CartItem | undefined;
}


const CartContext = createContext<CartContextType | undefined>(undefined);


function CartProvider({ children }: providertype) {

    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('cart');
        }
    }, [cart]);

    function addToCart({ data }: hereCartitem) {
        console.log("saved")
        setCart((prevCards) => {
            const exists = prevCards.some((item) => {
                return item.productId === data.productId && item.color.name === data.color.name && item.size.size === data.size.size
            })
            if (exists) return prevCards
            return [...prevCards, data]
        })
    }

    function deleteFromCart(productId: number, color: string, size: string) {
        console.log("deleted", productId, color, size)
        setCart((prevData) => {
            return prevData.filter((product) => {
                return (product.productId !== productId || product.color.name !== color || product.size.size !== size)
            });
        })
    }

    function updateQuantity({ productId, color, size, quantity }: updateQuantityProps) {
        setCart((prevCart) => {
            const index = prevCart.findIndex(
                item =>
                    item.productId === productId &&
                    item.color.name === color.name &&
                    item.size.size === size.size
            );

            if (index !== -1) {
                const updatedCart = [...prevCart];
                if (quantity === 0) {
                    updatedCart.splice(index, 1);
                } else {
                    updatedCart[index].quantity = quantity;
                }
                return updatedCart;
            }
            return prevCart;
        });
    }

    const isInCart = (productId: number, color: Colors, size: Sizes) => {
        return cart.some(item => {
            return item.productId === productId && item.color.name === color.name && item.size.size === size.size
        })
    };

    const getCartProduct = (productId?: number | string): CartItem | undefined => {
        return cart.find((item) => item.productId === productId);
    };

    const clearCart = () => {
        setCart([]);
    };


    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            deleteFromCart,
            updateQuantity,
            clearCart,
            getCartProduct,
            isInCart

        }}>
            {children}
        </CartContext.Provider>
    )

}

const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};


export { CartProvider, useCart };