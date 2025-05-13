import { ProductsProps } from "@/types/interfaces";
import { mysupabase } from "./SupabaseConfig";
import { useEffect } from "react";

async function getAllProducts() {
  const { data: products, error } = await mysupabase
    .from("products")
    .select("*,discounts(*)")
    .eq("is_new_arrival", false);
  if (products) {
    return products;
  } else {
    return new Error(error.message);
  }
}

async function getAllBlogs() {
  try {
    const { data: blogs, error } = await mysupabase.from("blogs").select("*");
    if (blogs) {
      return blogs;
    } else {
      return new Error(error.message);
    }
  } catch (error) {}
}

async function getblog(slug: string) {
  try {
    if (slug) {
      const { data, error } = await mysupabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (data) {
        return data;
      } else {
        if (error?.message) {
          return new Error(error.message);
        }
      }
    }
  } catch (error: any) {
    return new Error(error.message);
  }
}

async function getAllCollections() {
  const { data: collections, error } = await mysupabase
    .from("collection")
    .select("*");
  if (collections) {
    return collections;
  } else {
    return new Error(error.message);
  }
}

async function getHighlighteProducts(slug: string) {
  const { data: highlighter, error } = await mysupabase
    .from("productsHighlighter")
    .select("*, product(*)")
    .eq("HighlighterType", slug);
  if (highlighter) {
    return highlighter;
  } else {
    return new Error(error.message);
  }
}

async function getAllBanner() {
  const { data: homebanner, error } = await mysupabase
    .from("HomeBanner")
    .select("*");
  if (homebanner) {
    return homebanner;
  } else {
    return new Error(error.message);
  }
}

async function getBannerBaseonSlug(slug:string) {
  const {data:banner,error}=await mysupabase.from("HomeBanner").select("*").eq("slug",slug)

   if (banner) {
    return banner;
  } else {
    return new Error(error.message);
  }
}

async function getAllTrendingProducts() {
  const { data: trendings, error } = await mysupabase
    .from("trendings")
    .select("*,products(*)");
  if (trendings) {
    return trendings;
  } else {
    return new Error(error.message);
  }
}

// async function getAllLimitedEditionProducts() {
//   const { data: trendings, error } = await mysupabase
//     .from("products")
//     .select("*, brands(*)")
//     .eq("is_limited_edition", true);
//   if (trendings) {
//     return trendings;
//   } else {
//     return new Error(error.message);
//   }
// }

async function getAllNewArrivalProducts() {
  const { data: newArrivals, error } = await mysupabase
    .from("products")
    .select("*,brands(*)")
    .eq("is_new_arrival", true);
  if (newArrivals) {
    return newArrivals;
  } else {
    return new Error(error.message);
  }
}

async function getAllNewCollections() {
  const { data: newCollections, error } = await mysupabase
    .from("collection")
    .select("*")
    .eq("is_new_collection", true);
  if (newCollections) {
    return newCollections;
  } else {
    return new Error(error.message);
  }
}

async function getProductData(slug: string) {
  try {
    const { data: product, error } = await mysupabase // Add `await` here
      .from("products")
      .select("*,brands(*),collection(*),discounts(*)")
      .eq("slug", slug)
      .single();

    if (error) {
      throw new Error(error.message); // Properly handle errors
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Return null instead of throwing an error
  }
}

async function getCollectionBanner() {
  try {
    const { data: collectionbanner, error } = await mysupabase
      .from("collectionBanner")
      .select("*")
      .limit(3);

    if (error) {
      throw new Error(error.message);
    }

    return collectionbanner;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getProductBaseOnCollection(slug: string) {
  try {
    if (!slug) {
      return null;
    }

    if (!["MEN", "WOMEN", "KIDS"].includes(slug)) {
      const { data: collectionBaseData, error } = await mysupabase
        .from("products")
        .select(
          `
      *,
      brands(*),
      collection!inner(id, slug),
      discounts(*)
    `
        )
        .eq("collection.slug", slug);

      if (error) {
        throw new Error(error.message);
      }
      return collectionBaseData;
    }

    if (["MEN", "WOMEN", "KIDS"].includes(slug)) {
      const { data: collectionBaseData, error } = await mysupabase
        .from("products")
        .select(
          `
        *,
        brands(*),
        collection(id, slug),
        discounts(*)
      `
        )
        .eq("gender", slug);

      if (error) {
        throw new Error(error.message);
      }
      return collectionBaseData;
    }
  } catch (error) {
    return null;
  }
}

async function getRelatedProducts(product: ProductsProps, slug: string) {
  if (!product) return [];

  const { data: relatedProducts, error } = await mysupabase
    .from("products")
    .select("*, brands(*), collection(*), discounts(*)")
    .or(
      `brand_key.eq.${product?.brand_key},collection_key.eq.${product?.collection_key}`
    )
    .neq("slug", slug) // Exclude the current product
    .limit(6);

  if (error) {
    throw new Error(error.message);
  }

  return relatedProducts;
}

async function getcollection(slug: string) {
  if (!slug) {
    return null;
  }
  const { data: collection, error } = await mysupabase
    .from("collection")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return new Error(error.message);
  }
  return collection;
}
async function getCollectionBaseOnGender(gender: string) {
  if (!gender) {
    return null;
  }
  const { data: genderCollections, error } = await mysupabase
    .from("collection")
    .select("*")
    .eq("gender", gender);

  if (error) {
    return new Error(error.message);
  }
  return genderCollections;
}

export {
  getAllProducts,
  getAllCollections,
  getAllBanner,
  getAllTrendingProducts,
  getAllNewArrivalProducts,
  getAllNewCollections,
  getProductData,
  getRelatedProducts,
  getCollectionBanner,
  getProductBaseOnCollection,
  getAllBlogs,
  getblog,
  getHighlighteProducts,
  getcollection,
  getCollectionBaseOnGender,
  getBannerBaseonSlug
};
