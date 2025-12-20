"use client";

import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getAllCollections } from "@/Supabase/SupabaseApi";
import { CollectionCardProps, NewProductProps } from "@/types/interfaces";
import { useQuery } from "react-query";
import MiniCollectionCard from "../Home/MiniCellectionCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
const MENU_ITEMS = [
  { label: "Best Selling", icon: true, link: "/collection/women" },

  { label: "All Products", icon: true, link: "/products" },
];

interface CommonMegaManuProps {
  children: React.ReactNode;
  urlProps: string;
}

const PROMOTIONS = [
  {
    id: "promo1",
    title: "65% OFF",
    subtitle: "UPTO",
    cta: "View All",
    bgColor: "bg-orange-600",
  },
  {
    id: "promo2",
    title: "NEW LAUNCH",
    subtitle: "",
    cta: "Shop Now",
    bgColor: "bg-green-600",
  },
];

function CummonMegaManu({ children, urlProps }: CommonMegaManuProps) {
  const [slug, setSlug] = useState("");
  const [gender, setGender] = useState(urlProps);
  const [selectProducts, setProducts] = useState<NewProductProps>();

  const {
    data: collections = { data: [] },
    isLoading: collectionLoading,
    isError: collectionError,
  } = useQuery<{ data: CollectionCardProps[] }>({
    queryKey: ["megamanucollections"],
    queryFn: () => getAllCollections("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-semibold px-2 py-1  lg:flex hidden  text-base xl:text-lg  items-center gap-2 text-primary hover:bg-transparent bg-transparent">
            {children}
          </NavigationMenuTrigger>

          <NavigationMenuContent className="min-w-[800px] left-0 h-[400px] relative p-3 rounded-lg border border-gray-200 grid grid-cols-[.5fr_2fr] gap-3">
            <aside className="w-full bg-white border-r border-border  overflow-y-auto">
              <div className="mb-8">
                <h3 className="text-base font-semibold text-primary mb-4">
                  Featured:
                </h3>
                <nav className="space-y-0">
                  {MENU_ITEMS.map((item) => (
                    <Link
                      href={`${item.link}`}
                      key={item.label}
                      // onClick={() => setSelectedMenuItem(item.label)}
                      className={`w-full flex items-center justify-between py-3 px-4 text-left border-b border-border transition-colors`}
                    >
                      <span>{item.label}</span>
                      {item.icon && <ChevronRight className="w-5 h-5" />}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="flex flex-col gap-4 overflow-y-auto">
              <span className="text-base font-semibold text-primary">
                Collections
              </span>
              <div className="grid grid-cols-5 gap-4">
                {collections.data && collections.data.length > 0 ? (
                  collections.data
                    .filter(
                      (col) =>
                        col?.gender?.toLowerCase() === urlProps.toLowerCase()
                    )
                    .slice(0, 6)
                    .map((collec, index) => {
                      const images = collec.image_urls?.map(
                        (obj: any, index: number) => JSON.parse(obj)
                      )[0];
                      console.log(images, "dsfkjshdflksdjfhlsdkfzDs");
                      return (
                        <Link
                          href={`/collections/${collec.slug}`}
                          key={collec.id}
                          className="flex flex-col items-center"
                        >
                          <div className="w-full aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-gray-200">
                            <img
                              src={images?.image_url || "/placeholder.svg"}
                              alt={collec.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-medium text-center text-foreground">
                            {collec.name}
                          </p>
                        </Link>
                      );
                    })
                ) : (
                  <div className="col-span-full text-center text-muted-foreground py-10">
                    No collections found for <strong>{gender}</strong>.
                  </div>
                )}
              </div>
            </main>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default CummonMegaManu;
