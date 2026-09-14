import { mysupabase } from "@/Supabase/SupabaseConfig";
import { safeJsonParse, safeJsonParseArray } from "@/lib/utils";

export const SITE_URL = "https://shopmarkline.in";

export interface GeoVariant {
  id: number;
  sku: string;
  price: number;
  mrp?: number;
  retail_price?: number;
  stock: number;
  is_active: boolean;
  colors?: any;
  sizes?: any;
  image_url?: any;
  discounts?: any;
}

export interface GeoProduct {
  id: number;
  name: string;
  description: string | null;
  seoDescription: string | null;
  gender: string;
  materials_used: string;
  slug: string;
  created_at: string;
  is_limited_edition?: boolean;
  is_new_arrival?: boolean;
  brand?: { name?: string };
  collection?: { id?: number; name?: string; slug?: string };
  product_variants?: GeoVariant[];
}

export interface GeoCollection {
  id: number;
  name: string;
  slug: string;
  discription?: string;
  description?: string;
  gender: string;
  type: string;
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Fetch all active public products with variants.
 */
export async function getPublicProducts(): Promise<GeoProduct[]> {
  try {
    const { data, error } = await mysupabase
      .from("product")
      .select(
        `
        id,
        name,
        description,
        seoDescription,
        gender,
        materials_used,
        slug,
        created_at,
        is_limited_edition,
        is_new_arrival,
        brand:brands(name),
        collection:collection(id, name, slug),
        product_variants(
          id,
          sku,
          price,
          mrp,
          retail_price,
          stock,
          is_active,
          colors,
          sizes,
          image_url,
          discounts:discount_key(*)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching public products for GEO:", error?.message);
      return [];
    }

    // Filter products that have at least one active variant
    return (data as unknown as GeoProduct[]).filter((product) => {
      const activeVariants = product.product_variants?.filter((v) => v.is_active !== false);
      return activeVariants && activeVariants.length > 0;
    });
  } catch (err) {
    console.error("Exception in getPublicProducts:", err);
    return [];
  }
}

/**
 * Fetch all active collections.
 */
export async function getAllActiveCollections(): Promise<GeoCollection[]> {
  try {
    const { data, error } = await mysupabase
      .from("collection")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data) {
      console.error("Error fetching collections for GEO:", error?.message);
      return [];
    }

    return data as GeoCollection[];
  } catch (err) {
    console.error("Exception in getAllActiveCollections:", err);
    return [];
  }
}

/**
 * Clean up slug parameter by stripping '.md' extension if present.
 */
export function cleanSlug(slugParam: string): string {
  if (!slugParam) return "";
  return slugParam.replace(/\.md$/i, "").trim();
}

/**
 * Parse image URLs from variant image_url field safely.
 */
export function extractVariantImages(imageUrlData: any): string[] {
  if (!imageUrlData) return [];
  const parsed = safeJsonParseArray(imageUrlData);
  const urls: string[] = [];

  for (const item of parsed) {
    if (typeof item === "string" && item.trim().startsWith("http")) {
      urls.push(item.trim());
    } else if (typeof item === "object" && item !== null) {
      if (item.image_url && typeof item.image_url === "string") {
        urls.push(item.image_url.trim());
      } else if (item.url && typeof item.url === "string") {
        urls.push(item.url.trim());
      }
    }
  }
  return Array.from(new Set(urls));
}

/**
 * Format colors safely into readable strings.
 */
export function formatColors(colorData: any): string {
  if (!colorData) return "Standard";
  const parsed = safeJsonParseArray(colorData);
  const colorNames: string[] = [];

  for (const item of parsed) {
    if (typeof item === "string") {
      colorNames.push(item);
    } else if (typeof item === "object" && item !== null && item.name) {
      colorNames.push(item.name);
    }
  }
  return colorNames.length > 0 ? colorNames.join(", ") : "Standard";
}

/**
 * Format sizes safely into readable strings.
 */
export function formatSizes(sizeData: any): string {
  if (!sizeData) return "Standard";
  const parsed = safeJsonParseArray(sizeData);
  const sizeNames: string[] = [];

  for (const item of parsed) {
    if (typeof item === "string" || typeof item === "number") {
      sizeNames.push(String(item));
    } else if (typeof item === "object" && item !== null) {
      if (item.size) {
        sizeNames.push(item.unit ? `${item.size} (${item.unit})` : `${item.size}`);
      }
    }
  }
  return sizeNames.length > 0 ? sizeNames.join(", ") : "Standard";
}

/**
 * Compute actual selling price taking discount percentage into account.
 */
export function calculateSellingPrice(variant: GeoVariant): { price: number; mrp: number; finalPriceFormatted: string } {
  const basePrice = Number(variant.price) || Number(variant.mrp) || 0;
  const mrp = Number(variant.mrp) || Number(variant.price) || basePrice;

  let discountPercent = 0;
  if (variant.discounts && typeof variant.discounts === "object") {
    discountPercent = Number(variant.discounts.discount_persent) || 0;
  }

  const finalPrice = discountPercent > 0 ? basePrice - (basePrice * discountPercent) / 100 : basePrice;

  return {
    price: Math.round(finalPrice),
    mrp: Math.round(mrp),
    finalPriceFormatted: `₹${Math.round(finalPrice)} INR`,
  };
}

/**
 * Generate Markdown GEO representation for a single product.
 */
export async function getProductGeoMarkdown(rawSlug: string): Promise<string | null> {
  const slug = cleanSlug(rawSlug);
  if (!slug) return null;

  try {
    const { data: product, error } = await mysupabase
      .from("product")
      .select(
        `
        id,
        name,
        description,
        seoDescription,
        gender,
        materials_used,
        slug,
        created_at,
        is_limited_edition,
        is_new_arrival,
        brand:brands(name),
        collection:collection(id, name, slug),
        product_variants(
          id,
          sku,
          price,
          mrp,
          retail_price,
          stock,
          is_active,
          colors,
          sizes,
          image_url,
          discounts:discount_key(*)
        )
      `
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error || !product) {
      return null;
    }

    const geoProduct = product as unknown as GeoProduct;
    const activeVariants = geoProduct.product_variants?.filter((v) => v.is_active !== false) || [];
    if (activeVariants.length === 0) {
      return null;
    }

    const primaryVariant = activeVariants[0];
    const categoryName = geoProduct.collection?.name || geoProduct.gender || "Women's Footwear";
    const brandName = geoProduct.brand?.name || "Markline";
    const descriptionText = geoProduct.description || geoProduct.seoDescription || "Handcrafted premium women's footwear by Markline.";

    const totalStock = activeVariants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    const isAvailable = totalStock > 0;

    let allImages: string[] = [];
    activeVariants.forEach((v) => {
      allImages = allImages.concat(extractVariantImages(v.image_url));
    });
    allImages = Array.from(new Set(allImages));

    const canonicalProductUrl = `${SITE_URL}/product/${geoProduct.slug}`;

    let md = `# ${geoProduct.name}\n\n`;
    md += `Brand: ${brandName}\n`;
    md += `Category: ${categoryName}\n`;
    md += `Product type: Women's Footwear\n`;
    if (geoProduct.collection?.name) {
      md += `Collection: ${geoProduct.collection.name}\n`;
    }
    if (primaryVariant.sku) {
      md += `SKU: ${primaryVariant.sku}\n`;
    }
    md += `\n## Product Description\n\n${descriptionText}\n\n`;

    md += `## Product Details\n\n`;
    if (geoProduct.materials_used) {
      md += `* Material: ${geoProduct.materials_used}\n`;
    }
    md += `* Target Audience: ${geoProduct.gender || "WOMEN"}\n`;
    if (geoProduct.is_limited_edition) {
      md += `* Edition: Limited Edition\n`;
    }
    if (geoProduct.is_new_arrival) {
      md += `* Status: New Arrival\n`;
    }

    md += `\n## Variants\n\n`;
    activeVariants.forEach((variant, index) => {
      const colors = formatColors(variant.colors);
      const sizes = formatSizes(variant.sizes);
      const { finalPriceFormatted, mrp } = calculateSellingPrice(variant);
      const variantImages = extractVariantImages(variant.image_url);

      md += `### Variant ${index + 1}${variant.sku ? ` (${variant.sku})` : ""}\n`;
      if (variant.sku) md += `* SKU: ${variant.sku}\n`;
      md += `* Color: ${colors}\n`;
      md += `* Sizes Available: ${sizes}\n`;
      md += `* Stock Status: ${variant.stock > 0 ? `In Stock (${variant.stock} units)` : "Out of Stock"}\n`;
      if (mrp > 0) md += `* MRP: ₹${mrp} INR\n`;
      md += `* Price: ${finalPriceFormatted}\n`;
      if (variantImages.length > 0) {
        md += `* Main Image: ${variantImages[0]}\n`;
      }
      md += `\n`;
    });

    md += `## Availability\n\n${isAvailable ? "In Stock" : "Out of Stock"}\n\n`;
    md += `## Product URL\n\n${canonicalProductUrl}\n\n`;

    if (allImages.length > 0) {
      md += `## Images\n\n`;
      allImages.forEach((imgUrl) => {
        md += `* ${imgUrl}\n`;
      });
      md += `\n`;
    }

    md += `## Shipping\n\nFor official delivery timelines and shipping policy, visit: ${SITE_URL}/shipping-policy\n\n`;
    md += `## Returns\n\nFor official return window and policy details, visit: ${SITE_URL}/return-policy\n`;

    return md;
  } catch (err) {
    console.error(`Exception generating product GEO markdown for ${slug}:`, err);
    return null;
  }
}

/**
 * Generate Markdown GEO representation for a collection.
 */
export async function getCollectionGeoMarkdown(rawSlug: string): Promise<string | null> {
  const slug = cleanSlug(rawSlug);
  if (!slug) return null;

  try {
    const { data: collection, error } = await mysupabase
      .from("collection")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !collection) {
      return null;
    }

    const geoCollection = collection as GeoCollection;
    const descText = geoCollection.discription || geoCollection.description || geoCollection.seoDescription || `Discover the ${geoCollection.name} collection by Markline.`;

    // Fetch products belonging to this collection
    const { data: products } = await mysupabase
      .from("product")
      .select("id, name, slug, description, materials_used, product_variants(is_active)")
      .eq("collection_key", geoCollection.id)
      .order("created_at", { ascending: false });

    const activeProducts = ((products as any[]) || []).filter((p) => {
      const activeVars = p.product_variants?.filter((v: any) => v.is_active !== false);
      return activeVars && activeVars.length > 0;
    });

    const genderSlug = (geoCollection.gender || "women").toLowerCase();
    const canonicalCategoryUrl = `${SITE_URL}/collections/${genderSlug}/${geoCollection.slug}`;

    let md = `# ${geoCollection.name}\n\n`;
    md += `> ${descText}\n\n`;
    md += `## Category Details\n\n`;
    md += `* Brand: Markline\n`;
    md += `* Audience: ${geoCollection.gender || "WOMEN"}\n`;
    md += `* Collection Type: ${geoCollection.type || "Collection"}\n\n`;

    md += `## Relevant Occasions & Footwear Types\n\n`;
    md += `* Footwear Types: Women's heels, wedges, sandals, casual & festive footwear\n`;
    md += `* Occasions: Office wear, daily wear, party wear, weddings, festive celebrations\n\n`;

    md += `## Available Products (${activeProducts.length})\n\n`;
    if (activeProducts.length > 0) {
      activeProducts.forEach((p) => {
        md += `* **[${p.name}](${SITE_URL}/product/${p.slug})** — [LLM Markdown Document](${SITE_URL}/llms/products/${p.slug})\n`;
      });
      md += `\n`;
    } else {
      md += `No active products currently listed under this collection.\n\n`;
    }

    md += `## Canonical Category URL\n\n${canonicalCategoryUrl}\n`;

    return md;
  } catch (err) {
    console.error(`Exception generating collection GEO markdown for ${slug}:`, err);
    return null;
  }
}

/**
 * Generate main /llms.txt content dynamically.
 */
export async function getLlmsTxtContent(): Promise<string> {
  const collections = await getAllActiveCollections();

  let md = `# Markline\n\n`;
  md += `> Markline is an Indian women's footwear brand offering women's heels, wedges, sandals and casual footwear online in India.\n\n`;

  md += `## Brand\n\n`;
  md += `* [About Markline](${SITE_URL}/about-us)\n`;
  md += `* [Contact Markline](${SITE_URL}/contact-us)\n`;
  md += `* [Shipping Policy](${SITE_URL}/shipping-policy)\n`;
  md += `* [Return Policy](${SITE_URL}/return-policy)\n`;
  md += `* [Claim Policy](${SITE_URL}/claim-policy)\n`;
  md += `* [Privacy Policy](${SITE_URL}/privacy-policy)\n`;
  md += `* [Terms & Conditions](${SITE_URL}/terms-condition)\n\n`;

  md += `## Women's Footwear\n\n`;
  md += `* [Women's Footwear](${SITE_URL}/products/women)\n`;
  md += `* [Women's Heels](${SITE_URL}/collections/women)\n`;
  md += `* [Women's Wedges](${SITE_URL}/collections/women)\n`;
  md += `* [Women's Sandals](${SITE_URL}/products/women)\n`;
  md += `* [Casual Footwear](${SITE_URL}/products/women)\n`;
  md += `* [Party Wear Footwear](${SITE_URL}/products/women)\n`;
  md += `* [Wedding & Festive Footwear](${SITE_URL}/products/women)\n\n`;

  md += `## Heel Categories\n\n`;
  md += `* [Block Heels](${SITE_URL}/collections/women)\n`;
  md += `* [Pencil Heels](${SITE_URL}/collections/women)\n`;
  md += `* [Kitten Heels](${SITE_URL}/collections/women)\n`;
  md += `* [Platform Heels](${SITE_URL}/collections/women)\n`;
  md += `* [Party Wear Heels](${SITE_URL}/collections/women)\n\n`;

  md += `## Wedges\n\n`;
  md += `* [Women's Wedges](${SITE_URL}/collections/women)\n`;
  md += `* [Platform Wedges](${SITE_URL}/collections/women)\n\n`;

  md += `## Sandals\n\n`;
  md += `* [Women's Sandals](${SITE_URL}/products/women)\n`;
  md += `* [Casual Sandals](${SITE_URL}/products/women)\n`;
  md += `* [Party Wear Sandals](${SITE_URL}/products/women)\n\n`;

  if (collections.length > 0) {
    md += `## Collections\n\n`;
    collections.forEach((col) => {
      const genderSlug = (col.gender || "women").toLowerCase();
      md += `* [${col.name}](${SITE_URL}/collections/${genderSlug}/${col.slug}) — [LLM GEO Document](${SITE_URL}/llms/collections/${col.slug})\n`;
    });
    md += `\n`;
  }

  // Fetch and list active products directly in llms.txt
  const products = await getPublicProducts();

  md += `## Products\n\n`;
  md += `> Full index: [${SITE_URL}/llms/products](${SITE_URL}/llms/products)\n\n`;

  if (products.length > 0) {
    products.forEach((product) => {
      const productUrl = `${SITE_URL}/product/${product.slug}`;
      const geoUrl = `${SITE_URL}/llms/products/${product.slug}`;
      md += `* [${product.name}](${productUrl}) — [LLM Document](${geoUrl})\n`;
    });
    md += `\n`;
  } else {
    md += `* No active products available at this time.\n\n`;
  }

  md += `## Important Information\n\n`;
  md += `The official Markline product pages are the authoritative source for current product names, descriptions, materials, available sizes, colors, prices, stock availability, SKUs, and product images.\n`;

  return md;
}
