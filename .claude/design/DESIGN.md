# Markline Luxury Footwear Design System (DESIGN.md)

**Design Name:** markline-luxury-commerce  
**Architecture:** Modern Minimalist E-Commerce (Human-Crafted, High-Trust)  
**Target:** Elimination of AI-generated aesthetics; Establishment of premium, trustworthy fashion brand visual language.

---

## 1. Visual Theme & Atmosphere

- **Archetype:** Minimalist Luxury Fashion & Footwear (similar to Massimo Dutti, Net-a-Porter, Studio Nicholson).
- **Core Principle:** Restraint over excess. No loud neon gradients, no random border-radii, no conflicting font weights.
- **Lighting & Surfaces:** Clean, crisp alabaster background (`#FBFBFB` / `#FAFAFA`) with pure white (`#FFFFFF`) card surfaces and subtle hairline 1px borders (`#E5E7EB`).
- **Tactile Feedback:** Instant, smooth 200ms ease-out transitions on hovers and clicks; no jittery layout shifts.

---

## 2. Color Palette & Semantic Tokens

### Primary Brand
| Token | Hex / HSL | Role | Contrast on White |
|---|---|---|---|
| `--primary` | `#0A0A0A` (`0 0% 4%`) | Core Brand, Primary Buttons, Headings | 19.5:1 (WCAG AAA) |
| `--primary-foreground` | `#FFFFFF` | Text on Primary Buttons/Headers | 19.5:1 (WCAG AAA) |

### Supporting & Surfaces
| Token | Hex / HSL | Role | Purpose |
|---|---|---|---|
| `--background` | `#FAFAFA` (`0 0% 98%`) | Base Page Canvas | Soft off-white that reduces eye strain and feels premium |
| `--card` / `--surface` | `#FFFFFF` (`0 0% 100%`) | Product Cards, Modals, Drawers | Crisp elevated surface |
| `--secondary` | `#F3F4F6` (`210 20% 96%`) | Badges, Secondary Actions, Pill tags | Subtle contrast without color clash |
| `--secondary-foreground` | `#111827` (`210 24% 11%`) | Text on secondary elements | 15.2:1 (WCAG AAA) |

### Neutrals (Typography & Dividers)
| Token | Hex / HSL | Usage |
|---|---|---|
| `--foreground` | `#0F172A` | Primary Body & Titles (deep charcoal, softer than pure `#000`) |
| `--muted-foreground` | `#64748B` | Secondary details, breadcrumbs, sku, timestamps |
| `--border` | `#E2E8F0` (`0 0% 89.8%`) | Subtle hairline dividers and card perimeters |
| `--ring` | `#0A0A0A` | Clean focus outline for accessibility |

### Status Tokens (E-Commerce Trust)
| State | Hex | Role |
|---|---|---|
| `--success` | `#16A34A` | In Stock, Free Shipping, Order Verified, COD Available |
| `--destructive` | `#DC2626` | Low Stock / Out of Stock, Sale badges, Error alerts |
| `--warning` | `#D97706` | Pending verification, Cart reservation timers |

---

## 3. Typography Architecture

**Primary Typeface:** `Plus Jakarta Sans`, sans-serif  
**Secondary/Editorial Accent:** `Geist Sans` (for clean tabular numerals, prices, and specs)  
*All font rendering MUST have `-webkit-font-smoothing: antialiased;` applied.*

### Type Scale Hierarchy
| Level | Class | Size | Line Height | Weight | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| Display | `text-4xl md:text-5xl` | 36px / 48px | 1.1 | Bold (700) | `-0.02em` | Hero Titles, Collection Statements |
| Heading 1 | `text-2xl md:text-3xl` | 24px / 30px | 1.2 | Semibold (600) | `-0.01em` | Section Titles, Product Titles |
| Heading 2 | `text-xl md:text-2xl` | 20px / 24px | 1.25 | Semibold (600) | Normal | Card Titles, Modal Headers |
| Subheading | `text-base md:text-lg` | 16px / 18px | 1.4 | Medium (500) | Normal | Filters, Navigation Links, Price display |
| Body | `text-sm` | 14px | 1.5 | Normal (400) | Normal | Descriptions, Reviews, Specs |
| Caption / Micro | `text-xs` | 12px | 1.4 | Medium (500) | `0.05em` | Badges, Sizing, Uppercase Trust Labels |

---

## 4. Component Standards

### A. Buttons (Tactile & High-Trust)
- **Primary Action (Buy Now, Add to Cart):**
  - Height: `h-12` (48px)
  - Background: `bg-primary text-white`
  - Border: 1px solid transparent
  - Radius: `rounded-xl`
  - Hover: `hover:bg-zinc-800 active:scale-[0.99] transition-all duration-200`
  - Font: `text-xs md:text-sm font-semibold tracking-wider uppercase`
- **Secondary / Filter Action:**
  - Background: `bg-white text-zinc-900 border border-zinc-200`
  - Radius: `rounded-xl`
  - Hover: `hover:bg-zinc-50 hover:border-zinc-300`

### B. Product Cards
- **Image Aspect Ratio:** Strictly `aspect-[3/4]` or `aspect-[4/5]` across all collections. No stretched or cropped images.
- **Card Container:** `bg-white rounded-xl border border-zinc-100 overflow-hidden group`
- **Image Hover:** `group-hover:scale-[1.03] transition-transform duration-500 ease-out`
- **Price Display:**
  - Sale Price: `text-sm md:text-base font-bold text-zinc-900`
  - MRP (Strikethrough): `text-xs text-zinc-400 line-through ml-2`
  - Discount Tag: `text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded`

### C. Trust & Authenticity Badges
- No neon banners. Instead use subtle, pill-shaped trust indicators:
  - `COD Available`
  - `7-Day Easy Exchange`
  - `100% Genuine Handcrafted`

---

## 5. Spacing & Layout Rhythm

Strict 4px/8px incremental scale:
- `gap-2` (8px) — micro-elements, button icons
- `gap-4` (16px) — grid cards on mobile, form fields
- `gap-6` (24px) — grid cards on desktop, section subsections
- `gap-12` / `gap-16` (48px / 64px) — major page sections

**Max Container Width:**
- Standard: `max-w-7xl` (1280px) centered with `px-4 sm:px-6 lg:px-8`
- Editorial Collections: `max-w-[1400px]`

---

## 6. Border Radius Standardization

Eliminate arbitrary radius chaos. Standardize to 3 tokens:
1. `micro`: `rounded-md` (6px) — pills, badges, small swatches
2. `standard`: `rounded-xl` (12px) — buttons, inputs, product cards
3. `modal`: `rounded-2xl` (16px) — dialogs, bottom sheets, floating drawers

---

## 7. Motion & Transitions

- Micro-interactions: `transition-all duration-200 ease-out`
- Modals / Popovers: Framer Motion spring: `transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }`
- Lazy Loading: Zero layout shift; skeletons mirror exact dimensions of loaded cards.
