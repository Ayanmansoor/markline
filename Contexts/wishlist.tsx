'use client';
import { whishlishtProps } from '@/types/interfaces';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import { safeJsonParse } from '@/lib/utils';

interface IsProductInterface {
  productId: string | number;
}

interface WishlistContextInterface {
  wishlist: whishlishtProps[];
  addToWishlist: (data: whishlishtProps) => void;
  removeFromWishlist: ({ productId }: IsProductInterface) => void;
  isProductInWishlist: ({ productId }: IsProductInterface) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextInterface | undefined>(undefined);

// --- Helper: convert Supabase row to whishlishtProps ---
function rowToWishlistItem(row: any): whishlishtProps {
  return {
    productId: row.product_id,
    name: row.name || '',
    price: row.price || 0,
    quantity: 1,
    color: [],
    size: [],
    image_urls: row.image_url ? [{ url: row.image_url, image_url: row.image_url, name: '' }] : [],
    discounts: row.discount_percent ? {
      discount_id: '',
      name: '',
      discount_persent: row.discount_percent,
      discount_start: '',
      discount_end: '',
      created_at: '',
      updated_at: '',
    } : null as any,
    discount_key: row.discount_key || '',
    slug: row.slug || '',
  };
}

// --- Helper: convert whishlishtProps to Supabase row ---
function wishlistItemToRow(item: whishlishtProps, uid: string) {
  const firstImage = Array.isArray(item.image_urls) && item.image_urls.length > 0
    ? item.image_urls[0]?.image_url
    : null;

  return {
    user_id: uid,
    product_id: item.productId,
    name: item.name,
    slug: item.slug,
    price: item.price,
    discount_key: item.discount_key || null,
    discount_percent: item.discounts?.discount_persent || null,
    image_url: firstImage,
  };
}

function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<whishlishtProps[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Supabase Helpers ---

  async function fetchWishlistFromSupabase(uid: string): Promise<whishlishtProps[]> {
    const { data, error } = await mysupabase
      .from('wishlist')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
    return (data || []).map(rowToWishlistItem);
  }

  async function migrateGuestWishlistToSupabase(uid: string) {
    try {
      const stored = localStorage.getItem('wishlist');
      if (!stored) return;
      const guestItems: whishlishtProps[] = safeJsonParse(stored, []) || [];
      if (!guestItems.length) return;

      for (const item of guestItems) {
        await mysupabase
          .from('wishlist')
          .upsert(wishlistItemToRow(item, uid), {
            onConflict: 'user_id,product_id',
          });
      }
      localStorage.removeItem('wishlist');
    } catch (err) {
      console.error('Error migrating guest wishlist:', err);
    }
  }

  // --- Auth Listener & Init ---

  useEffect(() => {
    mysupabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        const items = await fetchWishlistFromSupabase(session.user.id);
        setWishlist(items);
      } else {
        // Guest: load from localStorage
        try {
          const saved = localStorage.getItem('wishlist');
          if (saved) setWishlist(safeJsonParse(saved, []) || []);
        } catch {
          // ignore malformed data
        }
      }
      setIsInitialized(true);
    });

    const { data: { subscription } } = mysupabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUserId(session.user.id);
          await migrateGuestWishlistToSupabase(session.user.id);
          const items = await fetchWishlistFromSupabase(session.user.id);
          setWishlist(items);
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
          setWishlist([]);
          localStorage.removeItem('wishlist');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Guest localStorage sync
  useEffect(() => {
    if (!isInitialized || userId) return;
    try {
      if (wishlist.length > 0) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } else {
        localStorage.removeItem('wishlist');
      }
    } catch (error) {
      console.error('WishlistProvider: Failed to sync wishlist:', error);
    }
  }, [wishlist, isInitialized, userId]);

  // --- Wishlist Actions ---

  const addToWishlist = (data: whishlishtProps) => {
    const exists = wishlist.some((item) => item.productId === data.productId);

    if (exists) {
      removeFromWishlist({ productId: data.productId });
      return;
    }

    // ✅ Update UI immediately (optimistic)
    setWishlist((prev) => [...prev, data]);

    // Sync to Supabase in background
    if (userId) {
      mysupabase
        .from('wishlist')
        .upsert(wishlistItemToRow(data, userId), {
          onConflict: 'user_id,product_id',
        })
        .then(({ error }) => {
          if (error) {
            console.error('Wishlist sync error (add):', error);
            alert(`DEBUG WISHLIST ERROR: ${error.message}`);
          }
        });
    }
  };

  const removeFromWishlist = ({ productId }: IsProductInterface) => {
    // ✅ Update UI immediately (optimistic)
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));

    // Sync to Supabase in background
    if (userId) {
      mysupabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
        .then(({ error }) => {
          if (error) {
            console.error('Wishlist sync error (remove):', error);
            toast.error(`Wishlist DB Error: ${error.message}`);
          }
        });
    }
  };

  const isProductInWishlist = ({ productId }: IsProductInterface) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');

    if (userId) {
      mysupabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .then(({ error }) => {
          if (error) console.error('Wishlist sync error (clear):', error);
        });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

const useWishlists = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlists must be used within a WishlistProvider');
  }
  return context;
};

export { WishlistProvider, useWishlists };
