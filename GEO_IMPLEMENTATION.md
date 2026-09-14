# Markline GEO / LLM Discoverability Implementation Guide

Website: [https://shopmarkline.in](https://shopmarkline.in)  
Brand: **Markline** (Women's Footwear)

---

## 1. What Was Implemented

A comprehensive **Generative Engine Optimization (GEO)** and **LLM Discoverability Layer** was built into the Markline Next.js 15 application.

This layer enables AI search agents (e.g. ChatGPT / OpenAI SearchBot, Perplexity, Claude, Gemini, Google AI Overviews) to accurately index, understand, and extract Markline's brand entities, product attributes, prices, stock availability, and collection structures directly from authoritative Supabase data.

---

## 2. Architecture & Route Endpoints

### `/llms.txt`
* **Route**: `app/llms.txt/route.ts`
* **Public Endpoint**: `https://shopmarkline.in/llms.txt`
* **Content-Type**: `text/plain; charset=utf-8`
* **Description**: Dynamic root document providing an authoritative summary of Markline, key policy links, footwear categories, heel types, wedges, sandals, active collections, and a link to the LLM Product Index.

### `/llms/products`
* **Route**: `app/llms/products/route.ts`
* **Public Endpoint**: `https://shopmarkline.in/llms/products`
* **Content-Type**: `text/markdown; charset=utf-8`
* **Description**: Machine-readable product index listing all active/published Markline products with links to individual product GEO documents.

### `/llms/products/[slug]`
* **Route**: `app/llms/products/[slug]/route.ts`
* **Public Endpoint**: `https://shopmarkline.in/llms/products/[slug]` (also handles `.md` extension, e.g. `/llms/products/[slug].md`)
* **Content-Type**: `text/markdown; charset=utf-8`
* **Description**: Individual product GEO document containing structured product metadata (brand, category, SKU, materials, target audience, variants, color/size stock, prices, MRP, images, canonical URL, shipping & return links).

### `/llms/collections/[slug]`
* **Route**: `app/llms/collections/[slug]/route.ts`
* **Public Endpoint**: `https://shopmarkline.in/llms/collections/[slug]` (also handles `.md` extension, e.g. `/llms/collections/[slug].md`)
* **Content-Type**: `text/markdown; charset=utf-8`
* **Description**: Collection GEO document detailing category metadata, occasion suitability, footwear types, active product links, and canonical collection URL.

---

## 3. Data Integration & Supabase Binding

All GEO endpoints query public Supabase PostgreSQL tables in real-time via `lib/geo.ts`:
- **`product`**: Product names, descriptions, materials, gender, SEO fields, slugs.
- **`product_variants`**: SKUs, stock quantities, base prices, MRPs, discount keys, color/size arrays, image URLs. Excludes inactive (`is_active = false`) variants.
- **`collection`**: Category names, descriptions, gender, collection types.

---

## 4. Structured Data (Schema.org JSON-LD)

Implemented across key server-rendered page routes:
1. **Organization & WebSite**: `app/layout.tsx` (Logo, support contact, official social links, canonical site name "Markline").
2. **Product**: `app/(main)/product/[slug]/page.tsx` (Product name, image array, SKU, Brand Markline, Offer with priceCurrency INR, price, inStock/outOfStock status, free shipping details, 7-day return policy).
3. **CollectionPage**: `app/(main)/collections/[group]/[collection]/page.tsx`.
4. **BreadcrumbList**: `app/(main)/product/[slug]/page.tsx`, `app/(main)/collections/[group]/[collection]/page.tsx`, `app/(web)/blogs/[slug]/page.tsx`.

---

## 5. Robots & Sitemap Adjustments

* **`app/robots.txt`**: Explicitly permits `Googlebot`, `Bingbot`, and `OAI-SearchBot` while protecting sensitive paths (`/cart`, `/checkout`, `/account`, `/admin`, `/api/private`). Includes links to `sitemap.xml` and `llms.txt`.
* **`app/sitemap.ts`**: Standardized base domain to `https://shopmarkline.in`, dynamically includes homepage, static policy pages, active products, active collections, and published blogs.

---

## 6. Caching & Revalidation

* Route Handlers use `export const revalidate = 3600;` (1 hour server cache).
* Header includes `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
* Updates to products or collections automatically propagate into the GEO layer upon cache revalidation.

---

## 7. Local Testing & Verification

1. Start dev server: `npm run dev`
2. Test `/llms.txt`: `curl -i http://localhost:3000/llms.txt`
3. Test Product Index: `curl -i http://localhost:3000/llms/products`
4. Test Product GEO document: `curl -i http://localhost:3000/llms/products/sample-product-slug`
5. Test Collection GEO document: `curl -i http://localhost:3000/llms/collections/sample-collection-slug`
6. Verify robots.txt: `curl -i http://localhost:3000/robots.txt`
7. Verify sitemap: `curl -i http://localhost:3000/sitemap.xml`

---

## 8. Limitations & Scope

* The GEO layer is an information discovery and entity clarity system. It does not guarantee AI ranking position in search engines.
* Only public-facing catalog data is served. Private customer or operational data is excluded by design.
