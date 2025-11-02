import { selectColorAndSizesProps } from "@/components/Products/Products.page";
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
  materials_used: string;
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

export interface whishlishtProps {
  name: string;
  productId: number;
  price: number;
  quantity: number;
  color: Colors[];
  size: Sizes[];
  image_urls?: Images[];
  discounts: Discount;
  discount_key: string;
  slug: string;
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
  product: NewProductProps;
}

export interface trendingProductsProps {
  data: TrendingProductsProps[];
  productsCardCss?: string;
  title: string;
  discription: string;
}

export interface CategoriesSectionProps {
  children: React.ReactNode;
  title: string;
  url: string;
  subtitle?: string;
  urltext?: string;
  isH1?: boolean;
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
  addToWhishlistCB: (color: Colors[], size: Sizes[]) => void;
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
  created_at?: string;
  image_url: string;
  id: number;
  name: string;
  url: string;
  gender: string;
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
  closeSheet?: () => void;
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

// collection fo props

export interface CollectionsDataProps {
  collections: CollectionCardProps[];
  url: string;
}

export interface newCollectionCardProps {
  collections: CollectionCardProps;
  url: string;
  className?: string
  imageClass?: string
}

export interface ProdcutFilterProps {
  collection: CollectionCardProps[];
  children?: React.ReactNode;
  gender?: string;
  productRangevalue: number;
  SetselectColorAndSizes: React.Dispatch<
    React.SetStateAction<selectColorAndSizesProps>
  >;
  colors: Colors[];
  slug?: string;
  sizes: Sizes[];
  setPRoductRange: React.Dispatch<React.SetStateAction<number>>;
}

export interface ProductsDataProps {
  product: ProductsProps;
  url?: string;
  className?: string;
  user?: userinterfce;
  setConfirm?: React.Dispatch<React.SetStateAction<any>>;
}

export interface BuyComponentProps extends ProductsProps {
  selectedColor: Colors;
  selectedSize: Sizes;
  quantity: number;
}

export interface forProductsProps {
  product: BuyComponentProps;
  url?: string;
  className?: string;
  user?: userinterfce;
  setConfirm?: React.Dispatch<React.SetStateAction<any>>;
}

export interface AddressFromProps {
  product: ProductsProps;
  setConfirm: React.Dispatch<React.SetStateAction<any>>;
  setOrderID: React.Dispatch<React.SetStateAction<any>>;
  user?: userinterfce;
}

export interface GridProductProps {
  data: ProductsProps[];
  url: string;
  css?: string;
  productsCardCss?: string;
}
export interface CarouselProductProps {
  url: string;
  product: ProductsProps[];
  css?: string;
}

export interface whishlishtSectionProps {
  url: string;
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

export interface BuyProductProps {
  product: BuyComponentProps;
}

export interface ProductsHighlightesDataProps {
  data: ProductsHighlightesProps[];
  productsCardCss?: string;
}

export interface L2Bannerprop {
  created_at: string;
  image_url: string;
  id: number;
  name: string;
  url: string;
  slug?: string;
}

export interface L2DataProps {
  data: L2Bannerprop[];
}

//
export interface SpotlightInterfce {
  title?: string;
  description?: string;
  url?: string;
  images?: string[];
}

export interface userinterfce {
  id?: string;
  email?: string;
  phone?: string;
  user_metadata: {
    email?: string;
    phone?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
  };
}

export interface States {
  name: string;
  state_code: string;
}

export interface StateComboboxProps {
  setStateValue: (stateName: string) => void;
  errormessage: string;
  selectedState: string
}

export interface CityComboboxProps {
  setCityName: (cityname: string) => void;
  statename: string;
  errormessage: string;
  selectcity: string
}

export interface addressDailogprops {
  children: React.ReactNode;
  currentaddress?: AddressProps;
  handleperform?: () => void;
}

export interface AddressProps {
  id: number;
  user_id: string;
  name: string;
  state_name: string;
  city: string;
  pin_code: string;
  full_address: string;
  is_selected?: boolean | null;
  created_at?: string;
  index?: number;
  handleperform?: () => void;
}

export interface OrderProps {
  created_at: string; // ISO date string
  name: string;
  city: string;
  full_address: string;
  product_key: number;
  final_price: number;
  discount_amount: number;
  quantity: number;
  email: string;
  phone: string;
  state_name: string;
  pin_code: string;
  id: string;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  razorpay_signature: string | null;
  user_id: string;
  isDelivered: "PENDING" | "DELIVERED" | "CANCELLED"; // assuming possible statuses
  user_address: number;
}

export interface BulkOrderProductProps {
  name: string;
  email: string;
  phone: string;
  pin_code: string;
  state_name: string;
  city: string;
  full_address: string;
  final_price: number;
  quantity: number;
  discount_amount: number;
  product_key: number;
  color: string;
  size: string;
  user_id: string | null; // use string | null if it can be null
}

export interface UserInterface {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    email?: string;
    email_verified?: boolean;
    phone?: string;
    phone_verified?: boolean;
  };
}

// -----------------------------------------------------new-------------------------------------------------//

export interface NewDiscountProps {
  discount_id: string;
  name: string;
  discount_persent: number;
  discount_start: string; // ISO date string: "YYYY-MM-DD"
  discount_end: string; // ISO date string: "YYYY-MM-DD"
}

export interface CartVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  image_url: Images[];
  is_active: boolean;
  products_id: number;
  discount_key?: string;
  discounts?: NewDiscountProps;
  selectedColor: Colors;
  selectedSize: Sizes;
}

export interface newCartItem {
  productId: number;
  productName: string;
  slug: string;
  variant: CartVariant;
  quantity: number;
  gender: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  sizes: string[]; // These are JSON strings; will need parsing later into Size[]
  stock: number;
  colors: string[]; // These are also JSON strings; will need parsing into Color[]
  image_url: string[]; // Also JSON strings; will be parsed into Image[]
  is_active: boolean;
  created_at: string;
  products_id: number;
  discount_key?: string;
  discounts?: NewDiscountProps;
}

export interface newCarouselProductProps {
  url: string;
  product: NewProductProps[];
  css?: string;
  productsCardCss?: string;
}

export interface newProductsProps {
  product: NewProductProps;
  url?: string;
  className?: string;
  user?: userinterfce;
  setConfirm?: React.Dispatch<React.SetStateAction<any>>;
}

export interface NewGridProductProps {
  data: NewProductProps[];
  url: string;
  css?: string;
  productsCardCss?: string;
}

export interface ProductMainProps {
  variant?: ProductVariant | null;
  product?: NewProductProps | null;
}
export interface ProductMainAboutProps {
  variant: ProductVariant;
  product: NewProductProps;
  onVariantChange: (variant: any) => void;
}

export interface newAddToCardPopverProps {
  children: React.ReactNode;
  currentProduct: NewProductProps;
  currentVariant: ProductVariant;
  onVariantChange: (variant: any) => void;
  addToWhishlistCB: (color: Colors[], size: Sizes[]) => void;
}
export interface NewProductProps {
  id: number;
  name: string;
  description: string | null;
  gender: string;
  materials_used: string;
  collection_key: number;
  brand_key: string;
  is_limited_edition: boolean;
  is_new_arrival: boolean;
  seoTitle: string | null;
  seoDescription: string;
  created_at: string;
  slug: string;
  product_variants: ProductVariant[];
}

export interface newBuyComponentProps extends NewProductProps {
  selectedColor: Colors | null;
  selectedSize: Sizes | null;
  quantity: number;
}

export interface newBuyDailogProps {
  children: React.ReactNode;
  product: newBuyComponentProps;
  selectedVariant: ProductVariant;
}

export interface NewForProductsProps {
  product: newBuyComponentProps;
  variant: ProductVariant;
  url?: string;
  className?: string;
  selectedAddress: AddressProps | null;
  user?: userinterfce;
  setConfirm?: React.Dispatch<React.SetStateAction<any>>;
}

export interface NewAddressFromProps {
  product: newBuyComponentProps;
  variant: ProductVariant;
  setConfirm: React.Dispatch<React.SetStateAction<any>>;
  setOrderID: React.Dispatch<React.SetStateAction<any>>;
  user?: userinterfce;
  
}

export interface NEwProductsHighlightesProps {
  product: NewProductProps;
  HighlighterType: string;
}

export interface NEwProductsHighlightesDataProps {
  data: NEwProductsHighlightesProps[];
  productsCardCss?: string;
}

export interface AudienceProps {
  id: number; // int8
  name: "men" | "women" | "kids"; // genders enum
  seo_title: string | null; // text
  seo_discription: string | null; // text
  image: string | null; // text (URL of image)
  created_at: string; // timestamptz (ISO string)
}
