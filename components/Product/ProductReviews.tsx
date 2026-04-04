import React, { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import ReviewSummary from './Reviews/ReviewSummary';
import ReviewItem from './Reviews/ReviewItem';
import ReviewDrawer from './Reviews/ReviewDrawer';
import { getReviews } from '@/Supabase/SupabaseApi';
import { calculateRatingStats, mapSupabaseReviewToUI } from '@/lib/reviewUtils';
import { useQuery } from 'react-query';

interface ProductReviewsProps {
    productId: number;
    productName: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: rawReviews = [], isLoading, refetch } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => getReviews(productId),
        enabled: !!productId,
    });

    const reviews = useMemo(() => rawReviews.map(mapSupabaseReviewToUI), [rawReviews]);
    const stats = useMemo(() => calculateRatingStats(rawReviews), [rawReviews]);

    // Find the most helpful review or just use the first one for display
    const mostHelpfulReview = reviews.length > 0 ? reviews[0] : null;

    if (isLoading) {
        return (
            <div className="w-full py-10 flex justify-center">
                <span className="text-xs font-bold text-gray-400 animate-pulse">Accessing Registry...</span>
            </div>
        );
    }

    return (
        <div className="w-full mt-2 md:mt-10 space-y-3 md:space-y-8">
            <div className=" space-y-3 md:space-y-6">
                <h3 className=" text-base md:text-xl lg:text-2xl font-bold text-gray-800 uppercase tracking-tight">Rating & Reviews</h3>

                <ReviewSummary
                    averageRating={stats.averageRating}
                    totalRatings={stats.totalRatings}
                    totalReviews={stats.totalReviews}
                />
            </div>

            {mostHelpfulReview && (
                <div className=" space-y-1 md:space-y-4">
                    <h4 className=" text-base md:text-lg xl:text-xl font-bold text-gray-800">Most Helpful Review</h4>
                    <ReviewItem review={mostHelpfulReview} />
                </div>
            )}

            <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-full flex items-center justify-between  px-4 md:px-6 py-2 md:py-4 border-2 border-gray-200  hover:bg-gray-50 transition-all duration-300 group"
            >
                <span className="text-sm md:text-base lg:text-lg font-bold text-gray-800">
                    {reviews.length > 0 ? `Read all ${reviews.length} Reviews` : 'No reviews yet'}
                </span>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>

            <ReviewDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                reviews={reviews}
                stats={stats}
                productId={productId}
                productName={productName}
                onSuccess={() => refetch()}
            />
        </div>
    );
};

export default ProductReviews;
