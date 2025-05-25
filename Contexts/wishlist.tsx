'use client'
import { Colors, ProductsProps, Sizes, whishlishtProps } from "@/types/interfaces";
import React, { createContext, useState, useEffect, useContext } from "react";


interface IsProductIntefrce {
  productId: string | number,

}



interface wishlishtinterfce {
  wishlist: whishlishtProps[],
  addToWishlist: (data: whishlishtProps) => void,
  removeFromWishlist: ({ productId}: IsProductIntefrce) => void,
  isProductInWishlist: ({ productId }: IsProductIntefrce) => boolean,
  clearWishlist: () => void,
}


const WishlistContext = createContext<wishlishtinterfce | undefined>(undefined);

function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<whishlishtProps[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const clearWishlist = () => {
    setWishlist([]);
  };

  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } else {
      localStorage.removeItem("wishlist");
    }
  }, [wishlist]);

  const addToWishlist = (data: whishlishtProps) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some(
        (item) =>
          item.productId === data.productId 
      );

      if (exists) {
        return prevWishlist.filter(
          (item) =>
            !(
              item.productId === data.productId 
            )
        );
      } else {
        return [...prevWishlist, data];
      }
    });


  };

  const removeFromWishlist = ({
    productId,
  }: IsProductIntefrce) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter(
        (item) =>
          !(
            item.productId === productId 
          )
      )
    );
  };

  const isProductInWishlist = ({ productId }: IsProductIntefrce) => {
    return wishlist.some((item) => (item.productId === productId)
    )

  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        clearWishlist
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
