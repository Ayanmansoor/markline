'use client';
import { CartVariant } from '@/types/interfaces';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { toast } from 'sonner';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import axios from 'axios';
import { safeJsonParse } from '@/lib/utils';

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
  removeFromCart: ({ productId, colorName, size }: { productId: number; colorName: Colors | undefined; size: Sizes | undefined }) => void;
  updateQuantity: ({ productId, colorName, size, quantity }: { productId: number; colorName: Colors; size: Sizes; quantity: number }) => void;
  clearCart: () => void;
  isInCart: ({ variantId, colorName, size }: { variantId: number; colorName: string; size: string }) => boolean;
  getCartProduct: ({ variantId, colorName, size }: { variantId: number; colorName: string; size: string }) => newCartItem | undefined;
}

// --- Context ---

const CartContext = createContext<CartContextProps | undefined>(undefined);

// --- Helpers ---

function migrateOldCartItem(item: any): newCartItem | null {
  if (!item) return null;
  // If it's already in the new format, keep it
  if (item.variant && typeof item.variant === 'object') {
    return item;
  }
  // If it's in the old format, migrate it
  if (item.productId) {
    return {
      productId: item.productId,
      productName: item.name || item.productName || 'Product',
      slug: item.slug || '',
      gender: item.gender || '',
      quantity: item.quantity || 1,
      url: item.url || `/${item.slug || ''}`,
      variant: {
        id: item.variantId || item.variant?.id || 0,
        sku: item.variant?.sku || '',
        price: item.price || item.variant?.price || 0,
        stock: item.stock || 0,
        image_url: item.image_urls
          ? item.image_urls.map((img: any) => typeof img === 'string' ? safeJsonParse(img) : img).filter(Boolean)
          : (item.variant?.image_url || []),
        is_active: true,
        products_id: item.productId,
        selectedColor: item.color || item.variant?.selectedColor || { name: '', hex: '' },
        selectedSize: item.size || item.variant?.selectedSize || { size: '', unit: '' }
      }
    };
  }
  return null;
}

function rowToCartItem(row: any): newCartItem {
  return {
    productId: row.product_id,
    productName: row.product_name,
    slug: row.slug,
    gender: row.gender || '',
    quantity: row.quantity,
    url: `/${row.slug}`,
    variant: {
      id: row.variant_id,
      sku: row.variant_sku || '',
      price: row.variant_price,
      stock: 0,
      image_url: row.image_url
        ? [{ url: row.image_url, image_url: row.image_url, name: '' }]
        : [],
      is_active: true,
      products_id: row.product_id,
      selectedColor: { name: row.selected_color_name, hex: row.selected_color_hex || '' },
      selectedSize: { size: row.selected_size, unit: row.selected_size_unit || '' },
    },
  };
}

function cartItemToRow(item: newCartItem, uid: string) {
  const firstImage =
    Array.isArray(item.variant.image_url) && item.variant.image_url.length > 0
      ? (item.variant.image_url[0] as any)?.image_url ?? null
      : null;

  return {
    user_id: uid,
    product_id: item.productId,
    product_name: item.productName,
    slug: item.slug,
    gender: item.gender,
    variant_id: item.variant.id,
    variant_sku: item.variant.sku || '',
    variant_price: item.variant.price,
    selected_color_name: item.variant.selectedColor?.name || '',
    selected_color_hex: item.variant.selectedColor?.hex || '',
    selected_size: item.variant.selectedSize?.size || '',
    selected_size_unit: item.variant.selectedSize?.unit || '',
    quantity: item.quantity,
    image_url: firstImage,
  };
}

// --- Provider ---

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<newCartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ─── Supabase helpers (background sync) ───────────────────────────────────

  async function fetchCartFromSupabase(uid: string): Promise<newCartItem[]> {
    const { data, error } = await mysupabase
      .from('cart')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching cart from Supabase:', error);
      return [];
    }
    return (data || []).map(rowToCartItem);
  }

  async function migrateGuestCartToSupabase(uid: string) {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return;
      const guestItems: any[] = safeJsonParse(stored, []) || [];
      if (!guestItems.length) return;

      const migrated = guestItems.map(migrateOldCartItem).filter(Boolean) as newCartItem[];

      for (const item of migrated) {
        await mysupabase
          .from('cart')
          .upsert(cartItemToRow(item, uid), {
            onConflict: 'user_id,variant_id,selected_color_name,selected_size',
          });
      }
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Error migrating guest cart:', err);
    }
  }

  // ─── Auth init ─────────────────────────────────────────────────────────────

  useEffect(() => {
    mysupabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        const items = await fetchCartFromSupabase(session.user.id);
        setCart(items);
      } else {
        try {
          const stored = localStorage.getItem('cart');
          if (stored) {
            const parsed = safeJsonParse(stored, []);
            const migrated = Array.isArray(parsed)
              ? parsed.map(migrateOldCartItem).filter(Boolean) as newCartItem[]
              : [];
            setCart(migrated);
          }
        } catch { /* ignore */ }
      }
      setIsInitialized(true);
    });

    const { data: { subscription } } = mysupabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUserId(session.user.id);
          await migrateGuestCartToSupabase(session.user.id);
          const items = await fetchCartFromSupabase(session.user.id);
          setCart(items);
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
          setCart([]);
          localStorage.removeItem('cart');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Guest-only localStorage sync
  useEffect(() => {
    if (!isInitialized || userId) return;
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Cart: Failed to sync to localStorage:', error);
    }
  }, [cart, isInitialized, userId]);

  // ─── Cart Actions (Optimistic — UI first, Supabase in background) ──────────

  const addToCart = (item: newCartItem) => {
    const exists = cart.some(
      (i) =>
        i.variant?.id === item.variant?.id &&
        i.variant?.selectedColor?.name === item.variant?.selectedColor?.name &&
        i.variant?.selectedSize?.size === item.variant?.selectedSize?.size
    );
    
    if (exists) return;

    // ✅ Update UI immediately (optimistic)
    setCart((prev) => [...prev, item]);

    // Sync to Supabase in background (non-blocking)
    if (userId) {
      mysupabase
        .from('cart')
        .upsert(cartItemToRow(item, userId), {
          onConflict: 'user_id,variant_id,selected_color_name,selected_size',
        })
        .then(({ error }) => {
          if (error) {
             console.error('Cart sync error (add):', error);
             toast.error(`Supabase Error: ${error.message || 'Failed to save to database'}`);
          }
        });
    }
  };

  const removeFromCart = ({
    productId,
    colorName,
    size,
  }: {
    productId: number;
    colorName: Colors | undefined;
    size: Sizes | undefined;
  }) => {
    // ✅ Update UI immediately (optimistic)
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.productId === productId &&
            i.variant?.selectedColor?.name === colorName?.name &&
            i.variant?.selectedSize?.size === size?.size
          )
      )
    );

    // Sync to Supabase in background
    if (userId) {
      axios.post('/api/delete-cart-item', {
        userId,
        productId,
        selectedColorName: colorName?.name,
        selectedSize: size?.size,
        clearAll: false
      }).then((res) => {
        if (res.data.error) {
          console.error('Cart sync error (remove):', res.data.error);
        }
      }).catch((err) => {
        console.error('Cart remove API call failed:', err);
      });
    }
  };

  const updateQuantity = ({
    productId,
    colorName,
    size,
    quantity,
  }: {
    productId: number;
    colorName: Colors;
    size: Sizes;
    quantity: number;
  }) => {
    // ✅ Update UI immediately (optimistic)
    setCart((prev) =>
      prev.map((i) => {
        if (
          i.productId === productId &&
          i.variant?.selectedColor?.name === colorName?.name &&
          i.variant?.selectedSize?.size === size?.size
        ) {
          return { ...i, quantity };
        }
        return i;
      })
    );

    // Sync to Supabase in background
    if (userId) {
      const item = cart.find(
        (i) =>
          i.productId === productId &&
          i.variant?.selectedColor?.name === colorName?.name &&
          i.variant?.selectedSize?.size === size?.size
      );
      const variantId = item?.variant?.id || null;

      axios.post('/api/update-cart-quantity', {
        userId,
        variantId,
        productId,
        selectedColorName: colorName?.name,
        selectedSize: size?.size,
        quantity
      }).then((res) => {
        if (res.data.error) {
          console.error('Cart quantity sync error:', res.data.error);
        }
      }).catch((err) => {
        console.error('Cart quantity API call failed:', err);
      });
    }
  };

  const clearCart = () => {
    // ✅ Update UI immediately (optimistic)
    setCart([]);
    localStorage.removeItem('cart');

    // Sync to Supabase in background
    if (userId) {
      axios.post('/api/delete-cart-item', {
        userId,
        clearAll: true
      }).then((res) => {
        if (res.data.error) {
          console.error('Cart sync error (clear):', res.data.error);
        }
      }).catch((err) => {
        console.error('Cart clear API call failed:', err);
      });
    }
  };

  const isInCart = ({
    variantId,
    colorName,
    size,
  }: {
    variantId: number;
    colorName: string;
    size: string;
  }): boolean => {
    return cart.some(
      (i) =>
        i.variant.id === variantId &&
        i.variant.selectedColor?.name === colorName &&
        i.variant.selectedSize?.size === size
    );
  };

  function getCartProduct({
    variantId,
    colorName,
    size,
  }: {
    variantId: number;
    colorName: string;
    size: string;
  }): newCartItem | undefined {
    return cart.find(
      (item) =>
        item.variant.id === variantId &&
        item.variant.selectedColor?.name === colorName &&
        item.variant.selectedSize?.size === size
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
