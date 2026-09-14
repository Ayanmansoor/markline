# Markline GEO Maintenance Guide

This document explains how the GEO / LLM discoverability layer is maintained and updated.

---

## IMPORTANT: DO NOT MANUALLY HARDCODE PRODUCTS

> [!WARNING]
> Do NOT create static `.md` files or hardcode product entries inside `/llms.txt`, `/llms/products`, or route files!
> The entire GEO layer is **database-driven** via Supabase.

---

## How Product & Collection Updates Flow Automatically

1. **Creating/Updating a Product in Supabase**:
   - When a new product is added or updated in the `product` / `product_variants` tables in Supabase, it automatically appears in `/llms/products` and becomes available at `/llms/products/[slug]`.
   - Prices, discounts, sizes, colors, images, and stock availability reflect automatically.

2. **Deactivating/Deleting a Product**:
   - Setting `is_active = false` on product variants automatically removes the product from `/llms/products` and causes `/llms/products/[slug]` to return HTTP 404 (Not Found).

3. **Collection Changes**:
   - Adding a new collection in the `collection` table automatically lists it under the `## Collections` section of `/llms.txt` and makes `/llms/collections/[slug]` active.

---

## What Developers Should Check When Making Schema / Database Changes

If you alter Supabase table structures:
1. **`lib/geo.ts`**: Verify that Supabase `.select(...)` queries match any renamed or added columns in `product`, `product_variants`, or `collection`.
2. **Types**: Ensure interfaces in `types/interfaces.ts` and `lib/geo.ts` are kept in sync.
3. **Data Privacy**: Never expose service role keys, order tables, customer metadata, or private fields in `lib/geo.ts`.

---

## Revalidation & Caching

The GEO routes use Next.js `revalidate = 3600;` (1-hour cache).
If immediate cache purging is required on deployment or product catalog updates, you can invoke Next.js `revalidatePath('/llms.txt')`, `revalidatePath('/llms/products')`, etc.
