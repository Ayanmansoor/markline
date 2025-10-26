import { ProductsProps } from "@/types/interfaces";
import { mysupabase } from "./SupabaseConfig";
import axios from "axios";




async function getAllBlogs() {
  try {
    const { data: blogs, error } = await mysupabase.from("blogs").select("*");
    if (blogs) {
      return blogs;
    } else {
      return new Error(error.message);
    }
  } catch (error) { }
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

async function getAllCollectionsBaseOnType(type: string, slug: string) {
  const { data: collections, error } = await mysupabase
    .from("collection")
    .select("*")
    .eq("type", type)
    .eq("slug", slug);
  if (collections) {
    return collections;
  } else {
    return new Error(error.message);
  }
}

async function getAllCollectionsBaseOnTypeForSeo(type: string) {
  const { data: collections, error } = await mysupabase
    .from("collection")
    .select("*")
    .eq("type", type);
  if (collections) {
    return collections;
  } else {
    return new Error(error.message);
  }
}

async function getAllCollectionsBaseOnGender(gender: string) {
  const { data: collections, error } = await mysupabase
    .from("collection")
    .select("*")
    .eq("gender", gender.toUpperCase());
  if (collections) {
    return collections;
  } else {
    return new Error(error.message);
  }
}

async function getHighlighteProducts() {
  const { data, error } = await mysupabase.from("productsHighlighter").select(`
      *,
      product (
        *,
        product_variants (*)
      )
    `);

  if (error) throw error;
  return data;
}

async function getCollectionBaseOnTypeAndOccuation(type: string, slug: string) {
  const { data, error } = await mysupabase
    .from("collection")
    .select(
      `
      *,
      product (
        *,
        product_variants (*)
      )
    `
    )
    .eq("type", type)
    .eq("slug", slug);

  if (error) {
    console.error("Error fetching collections:", error);
    return [];
  }

  return data;
}

async function getAllCollectionOccuation() {
  const { data, error } = await mysupabase
    .from("collection")
    .select(
      `
      *,
      product (
        *,
        product_variants (*)
      )
    `
    )
    .eq("type", "occasion");

  if (error) {
    console.error("Error fetching collections:", error);
    return [];
  }

  return data;
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

async function getBannerBaseonSlug(slug: string) {
  const { data: banner, error } = await mysupabase
    .from("HomeBanner")
    .select("*")
    .eq("slug", slug);

  if (banner) {
    return banner;
  } else {
    return new Error(error.message);
  }
}

async function getAllTrendingProducts() {
  const { data: trendings, error } = await mysupabase
    .from("trendings")
    .select("*,product(* , product_variants(*))");
  if (trendings) {
    return trendings;
  } else {
    return new Error(error.message);
  }
}





async function getAllNewArrivalProducts() {
  const { data: newArrivals, error } = await mysupabase
    .from("product")
    .select("*,brands(*),product_variants(*)")
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
    const { data: product, error } = await mysupabase
      .from("product")
      .select(
        `
    *,
    brand:brands(*),
    product_variants(*)
    `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return null;
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getAllCollectionBanner() {
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
    console.error("Error fetching product:");
    return null;
  }
}

async function getCollectionBannerBaseOnGender(gender: string) {
  try {
    const { data: genderbanner, error } = await mysupabase
      .from("collectionBanner")
      .select("*")
      .eq("gender", gender)
      .limit(3);

    if (error) {
      throw new Error(error.message);
    }

    return genderbanner;
  } catch (error) {
    console.error("Error fetching product:");
    return null;
  }
}
async function getProductBaseOnCollection(slug: string) {
  try {
    if (!slug) return null;

    const isGender = ["MEN", "WOMEN", "KIDS"].includes(slug);

    if (isGender) {
      const { data, error } = await mysupabase
        .from("product")
        .select(
          `
          *,
          brands(*),
          collection(*),
          product_variants(*)
        `
        )
        .eq("gender", slug);

      if (error) throw new Error(error.message);
      return data;
    }

    // First fetch collection ID based on slug
    const { data: collectionData, error: collectionError } = await mysupabase
      .from("collection")
      .select("id")
      .eq("slug", slug)
      .single();

    if (collectionError) throw new Error(collectionError.message);
    if (!collectionData) return [];

    // Now fetch products using collection_key
    const { data: products, error: productError } = await mysupabase
      .from("product")
      .select(
        `
        *,
        brands(*),
        collection(*),
        product_variants(*)
      `
      )
      .eq("collection_key", collectionData.id);

    if (productError) throw new Error(productError.message);
    return products;
  } catch (error) {
    console.error("Error fetching collection-based product:", error);
    return null;
  }
}

async function getRelatedProducts(product: ProductsProps, slug: string) {
  if (!product) return [];

  const { data: relatedProducts, error } = await mysupabase
    .from("product")
    .select(
      `
      *,
      product_variants(*)
    `
    )
    .or(
      `brand_key.eq.${product?.brand_key},collection_key.eq.${product?.collection_key}`
    )
    .neq("slug", slug)
    .limit(6);

  if (error) {
    console.error("Error fetching related products:", error.message);
    return [];
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


// post request

async function getCurrentUserOrders(userId: string) {
  try {
    const { data: orders, error } = await mysupabase
      .from("orders")
      .select(" * ,product(*) ,product_variants(*) ")
      .eq("user_id", userId);
    const { data: address, error: addressError } = await mysupabase
      .from("address")
      .select(" * ")
      .eq("user_id", userId);
    if (error) {
      return new Error(error.message);
    }
    return {
      orders,
      address,
    };
  } catch (error) { }
}

async function getCurrentUserSingleOrder(userId: string, orderId: string) {
  try {
    const { data: orders, error } = await mysupabase
      .from("orders")
      .select(" * ,product(*), variant_id(*)")
      .eq("user_id", userId)
      .eq("id", orderId);
    const { data: address, error: addressError } = await mysupabase
      .from("address")
      .select(" * ")
      .eq("user_id", userId);
    if (error) {
      return new Error(error.message);
    }
    return {
      orders,
      address,
    };
  } catch (error) { }
}

async function getSelectedAddress(userId: string | undefined) {
  const { data: address, error } = await mysupabase
    .from("address")
    .select("*")
    .eq("user_id", userId)
    .eq("is_selected", true)
    .maybeSingle();

  if (error) {
    return new Error(error.message);
  }
  return address;
}

async function updateCurrentUserAddress(userId: string, updatedAddress: any) {
  try {
    const { data, error } = await mysupabase
      .from("address")
      .update(updatedAddress)
      .eq("user_id", userId)
      .select();

    if (error) {
      return new Error(error.message);
    }
    return data;
  } catch (error) { }
}

// new

async function getAllCollectionWithProducts(gender: string) {
  try {
    const { data, error } = await mysupabase
      .from("collection")
      .select(
        `
    *,
    product:product(
      *,
      product_variants(*)
    )
  `
      )
      .eq("gender", gender)
      .eq("is_show", true);

    if (error) {
      return new Error(error.message);
    }
    return data;
  } catch (error) {
    console.log(error, "i getting");
  }
}
async function getaudience(audience: string) {
  try {
    const { data, error } = await mysupabase
      .from("audience")
      .select("*")
      .eq("name", audience);

    if (error) {
      return new Error(error.message);
    }
    return data[0];
  } catch (error) { }
}

async function getAllAudience() {
  try {
    const { data, error } = await mysupabase.from("audience").select("*");

    if (error) {
      return new Error(error.message);
    }
    return data;
  } catch (error) { }
}

async function getsearchProducts(query: string) {
  let data, error;

  if (query.trim()) {
    // If search query exists, filter products
    ({ data, error } = await mysupabase
      .from("product")
      .select(
        `
        *,
        product_variants(*)
      `
      )
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,materials_used.ilike.%${query}%,seoTitle.ilike.%${query}%,seoDescription.ilike.%${query}%`
      )
      .order("created_at", { ascending: false }));
  } else {
    ({ data, error } = await mysupabase
      .from("product")
      .select(
        `
        *,
        product_variants(*)
      `
      )
      .order("created_at", { ascending: false }));
  }

  if (error) {
    console.error("query error:", error);
    return [];
  }

  return data ?? [];
}







const fetchGroupOfProducts = async (type?: string) => {
  try {
    const response = await axios.get(`/api/main/group-of-products?type=${type}`);


    return response.data;
  } catch (error) {
    console.log(error, 'this is errror ')
    throw new Error("Failed to fetch groups of products");
  }
};


async function getAllProductsWithVariants() {
  try {
    const response = await axios.get("/api/main/getProducts");
    return response.data;
  } catch (error) {
    console.log(error, 'this is errror ')
    throw new Error("Failed to fetch groups of products");
  }
}

async function getAllCollections(type: string) {
  try {
    const response = await axios.get(`/api/main/collections?type=${type}`);


    return response.data;
  } catch (error) {
    console.log(error, 'this is errror ')
    throw new Error("Failed to fetch groups of products");
  }
}


async function getAllProductsbygender(gender: string) {
  try {
    const response = await axios.get(`/api/main/getProducts/${gender}`);


    return response.data;
  } catch (error) {
    console.log(error, 'this is errror ')
    throw new Error("Failed to fetch groups of products");
  }
}

async function getCollectionBaseOnGender(gender: string) {
  try {
    const response = await axios.get(`/api/main/collections/${gender}`);


    return response.data;
  } catch (error) {
    console.log(error, 'this is errror ')
    throw new Error("Failed to fetch groups of products");
  }
}
async function getProductDataSitemap() {
  try {
    const { data: product, error } = await mysupabase
      .from("product")
      .select(
        `
    *,
    brand:brands(*),
    product_variants(*)
    `
      )

    if (error) {
      console.error("Supabase error:", error.message);
      return null;
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}



export {
  getAllBanner,
  getAllTrendingProducts,
  getAllNewArrivalProducts,
  getAllNewCollections,
  getProductData,
  getRelatedProducts,
  getAllCollectionBanner,
  getProductBaseOnCollection,
  getAllBlogs,
  getblog,
  getHighlighteProducts,
  getcollection,
  getCollectionBaseOnGender,
  getBannerBaseonSlug,
  getCollectionBannerBaseOnGender,
  getAllCollectionsBaseOnGender,
  getCurrentUserOrders,
  updateCurrentUserAddress,
  getSelectedAddress,
  getAllCollectionWithProducts,
  getAllCollectionsBaseOnType,
  getCollectionBaseOnTypeAndOccuation,
  getAllCollectionOccuation,
  getaudience,
  getAllCollectionsBaseOnTypeForSeo,
  getsearchProducts,
  getAllAudience,
  getCurrentUserSingleOrder,






  // actuall api code
  getAllProductsbygender,
  getAllCollections,
  getAllProductsWithVariants,
  fetchGroupOfProducts,
  getProductDataSitemap
};
