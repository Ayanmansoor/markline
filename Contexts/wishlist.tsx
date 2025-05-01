'use client'
import { ProductsProps } from "@/types/interfaces";
import React, { createContext, useState, useEffect, useContext } from "react";

const WishlistContext = createContext({

});

function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } else {
      localStorage.removeItem("wishlist");
    }
  }, [wishlist]);

  const addToWishlist = (product: ProductsProps) => {
    setWishlist((prevWishlist: any[]) => {
      // Prevent adding duplicates
      if (!prevWishlist.some((item) => item.id === product.id)) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (productId: ProductsProps) => {
    setWishlist((prevWishlist: any) =>
      prevWishlist.filter((item: any) => item.id !== productId)
    );
  };

  const isProductInWishlist = (productId: any) => {
    return wishlist.some((item: any) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

const useWishlists = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlists must be used within a WishlistProvider");
  }

  return context;
};

export { WishlistProvider, useWishlists };
