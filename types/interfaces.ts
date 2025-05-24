import React, { JSX } from "react";

export interface Images {
  url: string;
  image_url: string;
  name: string;
}
export interface Colors {
  name: string;
  hex: string;
}

export interface Sizes {
  size: string;
  unit: string;
}

interface Discount {
  discount_id: string;
  name: string;
  discount_persent: number;
  discount_start: string; // ISO date string: "YYYY-MM-DD"
  discount_end: string; // ISO date string: "YYYY-MM-DD"
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface ProductsProps {
  quantity: any;
  brand_key: string;
  brands: any;
  collection_key: string;
  colors: Colors[];
  created_at: string;
  description: string;
  discount_key: string;
  discounts: Discount;
  gender: string;
  id: number;
  image_urls?: Images[];
  image_url?: Images[];
  is_limited_edition: boolean;
  is_new_arrival: boolean;
  name: string;
  price: number;
  seoDescription: string;
  sizes: Sizes[];
  slug: string;
  stock: number;
}

export interface CartProductsProps {
  brand_key: string;
  collection_key: string;
  colors: Colors;
  created_at: string;
  description: string;
  discount_key: string;
  discounts: Discount;
  gender: string;
  id: number;
  image_url: Images[];
  is_limited_edition: boolean;
  is_new_arrival: boolean;
  name: string;
  price: number;
  seoDescription: string;
  sizes: Sizes;
  slug: string;
  stock: number;
}

export interface CartItem {
  name: string;
  productId: number;
  price: number;
  quantity: number;
  color: Colors;
  size: Sizes;
  image_urls?: Images[];
  discounts: Discount;
  discount_key: string;
}

export interface updateQuantityProps {
  productId: number;
  color: Colors;
  size: Sizes;
  quantity: number;
}

export interface ProductsHighlightesProps {
  product: ProductsProps;
  HighlighterType: string;
}

export interface TrendingProductsProps {
  created_at?: string;
  id?: number;
  product_key?: number;
  products: ProductsProps;
}

export interface trendingProductsProps {
  data: TrendingProductsProps[];
}

export interface CategoriesSectionProps {
  children: React.ReactNode;
  title: string;
  url: string;
}

export interface HeroProps {
  css?: string;
  bannerImages: Images[];
}

export interface AddToCardPopverProps {
  children: React.ReactNode;
  currentProduct: ProductsProps;
  colors: Colors[];
  sizes: Sizes[];
  setIsInWhicshlist?:React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CollectionCardProps {
  discription: string;
  discount_key: string;
  gender: string;
  id: number;
  image_url?: Images[];
  image_urls?: Images[];
  is_new_collection: false;
  name: string;
  slug: string;
}

export interface homeBannervalue {
  created_at: string;
  image_url: string;
  id: number;
  name: string;
  url: string;
  slug?: string;
}

export interface orderData {
  orderID: string;
  email: string;
  username: string;
}

export interface OrderId {
  orderID: string;
  email: string;
  username: string;
}

export interface SheetCartFormProps {
  setConfirm: any;
  setOrderID: any;
}

export interface BlogCardProps {
  slug: string;
  image: string;
  title: string;
  discription: string;
}

export interface acceptorderProps {
  message: string;
  code: number;
  isOrder: boolean;
  data: any;
}

export interface whishlishtProps{
  id:number,
  colors:Colors,
  sizes:Sizes
}

// collection fo props

export interface CollectionsDataProps {
  collections: CollectionCardProps[];
  url: string;
}

export interface newCollectionCardProps {
  collections: CollectionCardProps;
  url: string;
}

export interface ProdcutFilterProps {
  collection: CollectionCardProps[];
  children?: React.ReactNode;
  productRangevalue: number;
  setPRoductRange: React.Dispatch<React.SetStateAction<number>>;
}

export interface ProductsDataProps {
  product: ProductsProps;
  url?: string;
}

export interface BuyComponentProps extends ProductsProps {
  selectedColor: Colors;
  selectedSize: Sizes;
  quantity: number;
}

export interface AddressFromProps {
  product: ProductsProps;
  setConfirm: React.Dispatch<React.SetStateAction<any>>;
  setOrderID: React.Dispatch<React.SetStateAction<any>>;
}

export interface GridProductProps {
  data: ProductsProps[];
  url: string;
  css?: string;
}
export interface CarouselProductProps {
  url: string;
  product: ProductsProps[];
}

export interface ColorViewProps {
  children: React.ReactNode;
  colors: Colors[];
  images?: Images[];
}

export interface SecondHeroProps {
  data: ProductsProps[];
  categoryName?: string;
}

export interface HeroData {
  bannerImages: homeBannervalue[];
  css?: string;
}
export interface BuyDailogProps {
  children: React.ReactNode;
  product: BuyComponentProps;
}

export interface ProductsHighlightesDataProps {
  data: ProductsHighlightesProps[];
}

export interface L2Bannerprop {
  created_at: string;
  image_url: string;
  id: number;
  name: string;
  url: string;
  slug?: string;
}

export interface L2DataProps{
  data:L2Bannerprop[]
}
