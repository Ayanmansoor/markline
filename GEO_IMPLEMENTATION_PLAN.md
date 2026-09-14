# GEO / LLM Discoverability Implementation Plan for Markline

Website: [https://shopmarkline.in](https://shopmarkline.in)  
Brand: **Markline** (Women's Footwear: Heels, Wedges, Sandals, Casual & Festive Footwear)

---

## Audit Findings & Project Assessment

| Audit Item | Current Project Implementation | Findings & Design Decisions |
| :--- | :--- | :--- |
| **Framework & Version** | Next.js 15.5.9 (App Router), React 18.3.1, TypeScript 5.9.3 | Standard Next.js App Router using `app/` directory. |
| **Server vs Client Rendering** | App Router Server Components (`page.tsx`) perform DB queries; Client components in `components/` handle UI/state | Dynamic route handlers (`route.ts`) in App Router can easily stream dynamic text/markdown with server-side caching (`revalidate = 3600`). |
| **Product Route Schema** | `/product/[slug]` | Individual product page route. Canonical URL: `https://shopmarkline.in/product/[slug]`. |
| **Audience Route Schema** | `/products/[slug]` | Audience / Gender page route (e.g. `/products/women`). Canonical URL: `https://shopmarkline.in/products/[slug]`. |
| **Collection Route Schema** | `/collections/[group]/[collection]` | Collection page route (e.g. `/collections/women/heels`). Canonical URL: `https://shopmarkline.in/collections/[group]/[collection]`. |
| **Data Source** | Supabase PostgreSQL via `@supabase/supabase-js` (`mysupabase` client) | Tables: `product`, `product_variants`, `collection`, `brands`, `discount_key`, `blogs`. All public-facing data is accessible via standard client queries. |
| **Active/Published Filtering** | Products with `product_variants` where `is_active` is `true` or stock > 0 | Deleted / private / inactive variants will be automatically excluded from GEO indexes and documents. |
| **Existing Sitemap** | `app/sitemap.ts` | Dynamically fetches blogs, products, and collections from Supabase. Needs URL cleanup and standardization. |
| **Existing Robots.txt** | `app/robots.txt` | Basic rules present. Missing explicit directives for AI/search bots (OAI-SearchBot, Bingbot, Googlebot) and disallow rules for sensitive paths (`/cart`, `/checkout`, `/account`, `/admin`, `/api/private`). |
| **Structured Data (JSON-LD)** | Present in `app/layout.tsx` (Organization) and `app/(main)/product/[slug]/page.tsx` (Product Offer) | Needs extension for WebSite, BreadcrumbList across product/collection/blog pages, and schema compliance. |

---

## Key Architecture Decisions

1. **Dynamic Generation**: All LLM documents (`/llms.txt`, `/llms/products`, `/llms/products/[slug]`, `/llms/collections/[slug]`) will be dynamically rendered via Next.js App Router `route.ts` handlers directly querying public Supabase data. No duplicate static markdown files will be maintained.
2. **URL Routing & Extensions**:
   - Main overview: `/llms.txt`
   - LLM Product Index: `/llms/products`
   - Product GEO document: `/llms/products/[slug]` (also handles `.md` extension, e.g., `/llms/products/[slug].md`)
   - Collection GEO document: `/llms/collections/[slug]` (also handles `.md` extension, e.g., `/llms/collections/[slug].md`)
3. **Caching & Revalidation**: Route handlers will use `export const revalidate = 3600;` (1 hour) to ensure zero database overhead while automatically reflecting catalog updates.
4. **Public Data Protection**: Only public fields (`name`, `description`, `materials_used`, `gender`, `colors`, `sizes`, `stock`, `price`, `mrp`, `image_url`, `slug`) will be rendered. No internal DB keys, service role credentials, order data, or customer details will ever be exposed.

---

## Proposed Changes

### Data Access & Helper Layer

#### [NEW] [lib/geo.ts](file:///c:/Users/Ayan/Documents/GitHub/markline/lib/geo.ts)
- Create helper functions:
  - `getPublicProducts()`: Fetches active products and variants from Supabase.
  - `getProductGeoMarkdown(slug)`: Generates structured Markdown for a specific product matching Phase 4 specs.
  - `getCollectionGeoMarkdown(slug)`: Generates structured Markdown for a collection matching Phase 9 specs.
  - `getAllActiveCollections()`: Fetches active collections from Supabase.

---

### LLM Discoverability Routes

#### [NEW] [app/llms.txt/route.ts](file:///c:/Users/Ayan/Documents/GitHub/markline/app/llms.txt/route.ts)
- Generates `/llms.txt` dynamically.
- Includes Brand intro, Footwear Categories (Women's heels, wedges, sandals, casual, party wear), Heel Types (Block, Pencil, Kitten, Platform), Wedges, Sandals, dynamic list of active Collections, link to `/llms/products`, and Authoritative Source notices.

#### [NEW] [app/llms/products/route.ts](file:///c:/Users/Ayan/Documents/GitHub/markline/app/llms/products/route.ts)
- Generates `/llms/products` (LLM Product Index).
- Lists all published active products with direct markdown links to `/llms/products/[slug]`.

#### [NEW] [app/llms/products/[slug]/route.ts](file:///c:/Users/Ayan/Documents/GitHub/markline/app/llms/products/[slug]/route.ts)
- Generates `/llms/products/[slug]` (and handles `.md` extension).
- Formats single product metadata, description, materials, available sizes/colors, variant stock/prices, canonical URL, product images, shipping & returns links.

#### [NEW] [app/llms/collections/[slug]/route.ts](file:///c:/Users/Ayan/Documents/GitHub/markline/app/llms/collections/[slug]/route.ts)
- Generates `/llms/collections/[slug]` (and handles `.md` extension).
- Formats collection metadata, footwear types, occasion suitability, list of included active products, and canonical URL.

---

### Robots & Sitemap Optimization

#### [MODIFY] [app/robots.txt](file:///c:/Users/Ayan/Documents/GitHub/markline/app/robots.txt)
- Directives for `*`, `Googlebot`, `Bingbot`, `OAI-SearchBot`.
- Disallow `/cart`, `/checkout`, `/account`, `/admin`, `/api/private`.
- Expose sitemap URL `https://shopmarkline.in/sitemap.xml` and `https://shopmarkline.in/llms.txt`.

#### [MODIFY] [app/sitemap.ts](file:///c:/Users/Ayan/Documents/GitHub/markline/app/sitemap.ts)
- Clean up canonical URLs (`https://shopmarkline.in`).
- Include main static pages, active products, active collections, and blogs.
- Exclude draft or private routes.

---

### Structured Data (Schema.org JSON-LD)

#### [MODIFY] [app/layout.tsx](file:///c:/Users/Ayan/Documents/GitHub/markline/app/layout.tsx)
- Enhance `Organization` schema with canonical brand name ("Markline"), official logo, contact information, social links (`sameAs`).
- Add `WebSite` schema with official URL `https://shopmarkline.in` and brand identity.

#### [MODIFY] [app/(main)/product/[slug]/page.tsx](file:///c:/Users/Ayan/Documents/GitHub/markline/app/(main)/product/[slug]/page.tsx)
- Upgrade `Product` JSON-LD schema: include `Brand`, `Offer` (with stock availability, priceCurrency INR, shippingDetails, returnPolicy), and `BreadcrumbList` schema.

#### [MODIFY] [app/(main)/collections/[group]/[collection]/page.tsx](file:///c:/Users/Ayan/Documents/GitHub/markline/app/(main)/collections/[group]/[collection]/page.tsx)
- Add `CollectionPage` and `BreadcrumbList` JSON-LD schemas.

#### [MODIFY] [app/(web)/blogs/[slug]/page.tsx](file:///c:/Users/Ayan/Documents/GitHub/markline/app/(web)/blogs/[slug]/page.tsx)
- Add `BreadcrumbList` JSON-LD alongside existing `BlogPosting` schema.

---

### Documentation & Maintenance Guides

#### [NEW] [GEO_IMPLEMENTATION.md](file:///c:/Users/Ayan/Documents/GitHub/markline/GEO_IMPLEMENTATION.md)
- Complete technical documentation detailing architecture, route endpoints, Schema types, crawler access rules, Supabase data binding, and local testing instructions.

#### [NEW] [GEO_MAINTENANCE.md](file:///c:/Users/Ayan/Documents/GitHub/markline/GEO_MAINTENANCE.md)
- Developer guidelines on how product updates automatically flow into the GEO layer without manual text edits.

---

## Verification Plan

### Automated Tests & Quality Checks
1. Run `npm run lint` to verify zero ESLint errors.
2. Run `npm run build` to verify successful Next.js server build and route bundling.

### Manual Route Verification
1. `GET /llms.txt`: Confirm Content-Type `text/plain; charset=utf-8` and correct category/brand structure.
2. `GET /llms/products`: Confirm list of active products with Markdown links.
3. `GET /llms/products/[slug]`: Confirm full Markdown product schema with prices, stock, sizes, colors, images, canonical links.
4. `GET /llms/collections/[slug]`: Confirm collection details and product links.
5. `GET /robots.txt`: Confirm bot rules and sitemap/llms.txt links.
6. `GET /sitemap.xml`: Confirm valid XML output with canonical URLs.
7. Validate JSON-LD outputs using Google Rich Results Test format.
