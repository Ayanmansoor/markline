'use client';
import React from 'react';
import { useWishlists } from '@/Contexts/wishlist';
import Link from 'next/link';
import { HeartCrack } from 'lucide-react';
import ProductCard from '@/components/Common/ProductCard';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlists()
    return (
        <div className="min-h-[70vh] bg-secondary py-10 px-5 lg:px-10 xl:px-20 2xl:px-40">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-8 border-b pb-4">
                My Wishlist
            </h1>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
                    <HeartCrack className="w-24 h-24 text-gray-300" />
                    <h2 className="text-xl md:text-2xl font-medium text-gray-600">Your wishlist is empty</h2>
                    <p className="text-gray-500 max-w-md">
                        Looks like you haven&apos;t added any items to your wishlist yet. Explore our collection and find something you love!
                    </p>
                    <Link
                        href="/collections"
                        className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-black transition-colors"
                    >
                        Explore Collections
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {wishlist.map((item) => {
                        // Map the wishlist item back to a structure ProductCard can understand
                        const dummyProduct = {
                            id: Number(item.productId),
                            name: item.name,
                            slug: item.slug || '',
                            description: "",
                            seoDescription: "",
                            category: "",
                            brand_key: "",
                            collection_key: "",
                            gender: "",
                            occasion: "",
                            discount_key: item.discount_key,
                            discounts: item.discounts,
                            product_variants: [
                                {
                                    id: Number(item.productId),
                                    sku: "",
                                    price: Number(item.price),
                                    stock: 1,
                                    is_active: true,
                                    products_id: Number(item.productId),
                                    colors: [],
                                    sizes: [],
                                    image_url: item.image_urls?.map(img => JSON.stringify(img)) || []
                                }
                            ]
                        };

                        return (
                            <div key={item.productId} className="relative group">
                                <ProductCard
                                    url="product"
                                    product={dummyProduct as any}
                                    className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[350px]"
                                />

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
