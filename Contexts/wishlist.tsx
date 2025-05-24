'use client'
import { ProductsProps, whishlishtProps } from "@/types/interfaces";
import React, { createContext, useState, useEffect, useContext } from "react";

interface wishlishtinterfce{
  wishlist : ProductsProps[],
  addToWishlist:(product:ProductsProps)=>void,
  removeFromWishlist:(id:string,color:string,size:string)=>void,
  isProductInWishlist:(id:number,color:string,size:string)=>boolean,
}


const WishlistContext = createContext<wishlishtinterfce|undefined>(undefined);

function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductsProps[]>([]);

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

  const addToWishlist = (product: whishlishtProps) => {
    setWishlist((prevWishlist: any[]) => {
      if (!prevWishlist.some((item) => item.id === product.id)) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });

    

  };

  const removeFromWishlist = (productId: string,color:string,size:string) => {
    setWishlist((prevWishlist: any) =>
      prevWishlist.filter((item: any) => item.id !== productId)
    );
  };

  const isProductInWishlist = (productId: string , color:string,size:string) => {
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
