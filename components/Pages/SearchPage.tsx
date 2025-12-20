"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { debounce } from "@/lib/searchdebounce";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import { getsearchProducts } from "@/Supabase/SupabaseApi";
import GridRroduct from "@/components/Home/GridRroduct";
import { MdOutlineArrowBack } from "react-icons/md";

function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(searchParams.get("q") || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (value: string) => {
    try {
      setLoading(true);
      const results = await getsearchProducts(value);

      setResults(results);
      console.log(results, "this is result");
    } catch (error) {
      console.error("Search API error:");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim().length > 0) {
        router.push(`/search?q=${encodeURIComponent(value)}`);
        fetchResults(value);
      } else {
        router.push(`/search`);
        setResults([]);
      }
    }, 500),
    [router]
  );

  function handleChange(value: string) {
    setSearch(value);
    debouncedSearch(value);
  }

  useEffect(() => {
    const paramValue = searchParams.get("q") || "";
    setSearch(paramValue);
    fetchResults(paramValue.trim());
  }, [searchParams]);

  return (
    <section className="w-full relative min-h-screen    bg-gray-200">
      <div className="flex  border-b border-gray-300 container  h-fit w-full gap-10 py-5  items-center justify-between">
        <span className="bg-white p-1 rounded-sm cursor-pointer">
          <MdOutlineArrowBack
            className="text-[20px] cursor-pointer text-primary  "
            onClick={() => router.back()}
          />
        </span>

        <span className="flex items-center self-end  w-full max-w-[400px] md:min-w-[350px] gap-2 rounded-lg bg-white border border-gray-300">
          <input
            type="text"
            placeholder="Search.."
            className="text-sm w-full cursor-pointer font-medium text-primary px-3 py-3 bg-transparent  "
            value={search}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button className="text-base font-medium text-primary cursor-pointer pr-4   pl-4 border-l-gray-200 border-l  ">
            <CiSearch className="text-[20px] text-primary " />
          </button>
        </span>
      </div>

      <div className="w-full gap-5  relative flex flex-col px-2 md:px-5 lg:px-10 py-2 md:py-5 lg:py-10 container ">
        {loading ? (
          <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4  items-start justify-start gap-3 px-5  lg:px-10   ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : results?.length ? (
          <GridRroduct
            data={results}
            url={"product"}
            css=" grid-cols-2 sm:grid-cols-2 md:grid-cols-3   gap-2 md:gap-3 lg:grid-cols-4 2xl:grid-cols-4 bg-gray-200 "
            productsCardCss=" h-[200px]  sm:h-[300px] md:h-[300px] xl:[300px] 2xl:h-[320px] 3xl:h-[350px]"
          />
        ) : (
          <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3  lg:grid-cols-4   items-start justify-start gap-3 px-5  lg:px-10   ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchPage;
