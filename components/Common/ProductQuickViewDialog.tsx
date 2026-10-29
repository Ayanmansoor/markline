"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Colors, Images, Sizes, ProductVariant } from "@/types/interfaces";
import { useCartContext } from "@/Contexts/Cart.context";
import { calculateVariantPrice } from "@/lib/pricing";
import { getCloudflareImageUrl, safeJsonParse } from "@/lib/utils";
import { Minus, Plus, Check, ShieldCheck, RefreshCcw, Truck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ProductQuickViewDialogProps {
  children: React.ReactNode;
  product: any;
  currentVariant?: ProductVariant;
  url?: string;
}

export default function ProductQuickViewDialog({
  children,
  product,
  currentVariant,
  url = "product",
}: ProductQuickViewDialogProps) {
  const [open, setOpen] = useState(false);
  const { addToCart, isInCart, getCartProduct, updateQuantity } = useCartContext();

  const [activeVariant, setActiveVariant] = useState<ProductVariant | undefined>(
    currentVariant || product?.product_variants?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<Colors | null>(null);
  const [selectedSize, setSelectedSize] = useState<Sizes | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Sync with currentVariant prop when dialog opens or prop changes
  useEffect(() => {
    if (currentVariant) {
      setActiveVariant(currentVariant);
    } else if (product?.product_variants?.[0]) {
      setActiveVariant(product.product_variants[0]);
    }
  }, [currentVariant, product, open]);

  // Extract images for active variant
  const parsedImages: Images[] = useMemo(() => {
    if (!activeVariant?.image_url) return [];
    return Array.isArray(activeVariant.image_url)
      ? activeVariant.image_url
        .map((item: any) =>
          typeof item === "string" ? safeJsonParse(item) : item
        )
        .filter(Boolean)
      : [];
  }, [activeVariant]);

  // Extract sizes for active variant
  const parsedSizes: Sizes[] = useMemo(() => {
    if (!activeVariant?.sizes) return [];
    return Array.isArray(activeVariant.sizes)
      ? activeVariant.sizes
        .map((item: any) =>
          typeof item === "string" ? safeJsonParse(item) : item
        )
        .filter(Boolean)
      : typeof activeVariant.sizes === "string"
        ? safeJsonParse(activeVariant.sizes) || []
        : [];
  }, [activeVariant]);

  // Extract all unique colors across all product variants
  const allColors: Colors[] = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    product?.product_variants?.forEach((variant: ProductVariant) => {
      let colorArray: Colors[] = [];
      if (Array.isArray(variant.colors)) {
        colorArray = variant.colors
          .map((item) =>
            typeof item === "string" ? safeJsonParse(item) : item
          )
          .filter(Boolean);
      } else if (typeof variant.colors === "string") {
        const parsed = safeJsonParse(variant.colors);
        colorArray = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
      }

      colorArray.forEach((color) => {
        if (color?.name && !colorMap.has(color.name)) {
          colorMap.set(color.name, color);
        }
      });
    });
    return Array.from(colorMap.values());
  }, [product]);

  // Initialize selected color and size
  useEffect(() => {
    if (activeVariant?.colors) {
      const colors: Colors[] = Array.isArray(activeVariant.colors)
        ? activeVariant.colors
          .map((c: any) => (typeof c === "string" ? safeJsonParse(c) : c))
          .filter(Boolean)
        : typeof activeVariant.colors === "string"
          ? safeJsonParse(activeVariant.colors) || []
          : [];
      if (colors[0]) {
        setSelectedColor(colors[0]);
      }
    }

    if (parsedSizes[0]) {
      setSelectedSize(parsedSizes[0]);
    } else {
      setSelectedSize(null);
    }
    setActiveImgIdx(0);
    setIsAdded(false);
  }, [activeVariant, parsedSizes]);

  // Price calculations
  const priceDetails = useMemo(() => {
    return calculateVariantPrice(
      activeVariant || {},
      activeVariant?.discounts
    );
  }, [activeVariant]);

  // Check if item is already in cart
  const inCart = useMemo(() => {
    if (!activeVariant?.id || !selectedColor?.name || !selectedSize?.size) {
      return false;
    }
    return isInCart({
      variantId: activeVariant.id,
      colorName: selectedColor.name,
      size: selectedSize.size,
    });
  }, [activeVariant, selectedColor, selectedSize, isInCart]);

  // Get existing cart item to sync quantity
  const existingCartItem = useMemo(() => {
    if (!activeVariant?.id || !selectedColor?.name || !selectedSize?.size) {
      return undefined;
    }
    return getCartProduct({
      variantId: activeVariant.id,
      colorName: selectedColor.name,
      size: selectedSize.size,
    });
  }, [activeVariant, selectedColor, selectedSize, getCartProduct, inCart]);

  // Sync quantity: if in cart, use cart quantity; otherwise default to 1
  useEffect(() => {
    if (inCart && existingCartItem?.quantity) {
      setQuantity(existingCartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [inCart, existingCartItem?.quantity, selectedColor?.name, selectedSize?.size, activeVariant?.id]);

  // Stepper handlers: update cart in real-time if item is in cart
  const handleIncreaseQuantity = () => {
    const maxStock = activeVariant?.stock && activeVariant.stock > 0 ? Math.min(activeVariant.stock, 10) : 10;
    if (quantity >= maxStock) {
      toast.error(`Maximum quantity available is ${maxStock}`);
      return;
    }
    const nextQty = quantity + 1;
    setQuantity(nextQty);

    if (inCart && product?.id && selectedColor && selectedSize) {
      updateQuantity({
        productId: product.id,
        colorName: selectedColor,
        size: selectedSize,
        quantity: nextQty,
      });
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) return; // Keep minimum 1 per user preference
    const nextQty = quantity - 1;
    setQuantity(nextQty);

    if (inCart && product?.id && selectedColor && selectedSize) {
      updateQuantity({
        productId: product.id,
        colorName: selectedColor,
        size: selectedSize,
        quantity: nextQty,
      });
    }
  };

  // Color change handler: switches variant
  const handleColorChange = (color: Colors) => {
    setSelectedColor(color);
    const matched = product?.product_variants?.find((variant: ProductVariant) => {
      try {
        const vColors: Colors[] = Array.isArray(variant.colors)
          ? variant.colors
            .map((c) => (typeof c === "string" ? safeJsonParse(c) : c))
            .filter(Boolean)
          : typeof variant.colors === "string"
            ? safeJsonParse(variant.colors) || []
            : [];
        return vColors.some((c) => c?.name === color.name);
      } catch {
        return false;
      }
    });
    if (matched) {
      setActiveVariant(matched);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!activeVariant) return;

    const cartItem = {
      productId: product.id,
      productName: product.name || "Product",
      slug: product.slug || "",
      gender: product.gender || "",
      quantity,
      url: `/${url}/${product.slug}`,
      variant: {
        id: activeVariant.id,
        sku: activeVariant.sku || "",
        price: activeVariant.price || 0,
        stock: activeVariant.stock || 0,
        image_url: parsedImages,
        is_active: activeVariant.is_active ?? true,
        products_id: activeVariant.products_id || product.id,
        discount_key: activeVariant.discount_key,
        discounts: activeVariant.discounts,
        selectedColor: selectedColor || { name: "", hex: "" },
        selectedSize: selectedSize || { size: "", unit: "" },
      },
    };

    addToCart(cartItem);
    setIsAdded(true);
    toast.success("Added to your bag!");
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const currentImg = parsedImages[activeImgIdx]?.image_url
    ? getCloudflareImageUrl(parsedImages[activeImgIdx].image_url)
    : "";

  const productUrl = `/${url}/${product?.slug}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-[98vw] md:w-full p-5 sm:p-7 md:p-8 bg-white border border-zinc-200/90 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{product?.name || "Product Details"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* LEFT: Product Gallery (Thumbnails + Main Stage) */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
            {/* Vertical thumbnails strip */}
            {parsedImages.length > 1 && (
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[420px] no-scrollbar shrink-0">
                {parsedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer ${activeImgIdx === idx
                      ? "border-zinc-950 ring-2 ring-zinc-950/20 shadow-xs scale-102"
                      : "border-zinc-200 hover:border-zinc-400 opacity-75 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={getCloudflareImageUrl(img.image_url)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-zinc-400 text-sm">No preview available</div>
              )}

              {/* Minimal Luxury Discount Pill */}
              {priceDetails.totalSavingsPercent > 0 && (
                <span className="absolute top-3 left-3 bg-zinc-900/95 text-white backdrop-blur-xs font-semibold text-xs px-2.5 py-1 rounded-md shadow-xs">
                  Save {priceDetails.totalSavingsPercent.toFixed(0)}%
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Product Details & Controls */}
          <div className="flex flex-col gap-4">
            {/* Brand / Category Micro Header */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {product?.gender || "Footwear"} • {product?.brands?.name || "Markline"}
              </span>
              {activeVariant?.sku && (
                <span className="text-[10px] text-zinc-400 font-mono">
                  SKU: {activeVariant.sku}
                </span>
              )}
            </div>

            {/* Product Title */}
            <div>
              <Link href={productUrl} onClick={() => setOpen(false)} className="group/title">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug group-hover/title:text-zinc-600 transition-colors">
                  {product?.name}
                </h2>
              </Link>
            </div>

            {/* Price Line (Clean Obsidian & Strikethrough) */}
            <div className="flex flex-col gap-1 border-y border-zinc-100 py-3.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  ₹{priceDetails.finalPrice.toLocaleString("en-IN")}
                </span>
                {priceDetails.totalSavingsPercent > 0 && (
                  <>
                    <span className="text-base text-zinc-400 line-through font-normal">
                      ₹{priceDetails.mrp.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                      {priceDetails.totalSavingsPercent.toFixed(0)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-500">MRP inclusive of all taxes.</p>
            </div>

            {/* Size Selector */}
            {parsedSizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                    Size:{" "}
                    <span className="font-normal text-zinc-600">
                      {selectedSize ? `${selectedSize.size} ${selectedSize.unit}` : "Select size"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {parsedSizes.map((size) => {
                    const isSelected = selectedSize?.size === size.size;
                    return (
                      <button
                        key={size.size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-11 rounded-xl border text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${isSelected
                          ? "bg-primary text-white border-primary shadow-xs scale-102"
                          : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-900"
                          }`}
                      >
                        {size.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {allColors.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                  Color:{" "}
                  <span className="font-normal text-zinc-600 capitalize">
                    {selectedColor?.name || "Standard"}
                  </span>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {allColors.map((color) => {
                    const isSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        title={color.name}
                        onClick={() => handleColorChange(color)}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${isSelected
                          ? "ring-2 ring-zinc-950 ring-offset-2 scale-110"
                          : "border-zinc-200 hover:border-zinc-400 hover:scale-105"
                          }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Bag (Markline Obsidian Brand Button) */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-zinc-200 rounded-xl px-2.5 py-2 shrink-0 bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-1 text-zinc-500 hover:text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-bold text-zinc-900 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    className="p-1 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Bag Button */}
                <button
                  type="button"
                  disabled={!selectedSize || inCart}
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-xl font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${inCart
                    ? "bg-zinc-100 border border-zinc-300/80 text-zinc-700 cursor-not-allowed shadow-2xs"
                    : "bg-primary hover:bg-zinc-800 text-white shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                    }`}
                >
                  {isAdded || inCart ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span>Added in Bag</span>
                    </>
                  ) : !selectedSize ? (
                    <span>Select Size</span>
                  ) : (
                    <span>Add to Bag</span>
                  )}
                </button>
              </div>

              {/* In-Bag Feedback & View Bag Link */}
              {inCart && (
                <div className="flex items-center justify-between text-xs px-1 pt-0.5">
                  <span className="text-zinc-500 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Item is in your bag (Qty: {quantity})
                  </span>
                  <Link
                    href="/carts"
                    onClick={() => setOpen(false)}
                    className="font-bold text-zinc-950 hover:underline inline-flex items-center gap-1 group/cart"
                  >
                    <span>View Bag</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/cart:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Truck className=" w-3 h-3 lg:w-4 lg:h-4 text-zinc-700 shrink-0" />
                <span className="text-xs lg:text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCcw className="w-3 h-3 lg:w-4 lg:h-4 text-zinc-700 shrink-0" />
                <span className=" text-xs lg:text-sm">7-Day Return</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 lg:w-4 lg:h-4 text-zinc-700 shrink-0" />
                <span className="text-xs lg:text-sm">100% Genuine</span>
              </div>
            </div>

            {/* Link to Full Product Page */}
            <Link
              href={productUrl}
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-zinc-800 hover:text-black tracking-wide inline-flex items-center gap-1.5 pt-1 group/link"
            >
              <span>View full product details & size guide</span>
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
