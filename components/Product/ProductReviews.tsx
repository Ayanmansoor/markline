import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ReviewSummary from './Reviews/ReviewSummary';
import ReviewItem from './Reviews/ReviewItem';
import ReviewDrawer from './Reviews/ReviewDrawer';
import { MOCK_REVIEWS, MOCK_RATING_STATS } from './Reviews/data';

const ProductReviews: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Find the most helpful review or just use the first one for display
    const mostHelpfulReview = MOCK_REVIEWS[0];

    return (
        <div className="w-full mt-2 md:mt-10 space-y-3 md:space-y-8">
            <div className=" space-y-3 md:space-y-6">
                <h3 className=" text-base md:text-xl lg:text-2xl font-bold text-gray-800 uppercase tracking-tight">Rating & Reviews</h3>

                <ReviewSummary
                    averageRating={MOCK_RATING_STATS.averageRating}
                    totalRatings={MOCK_RATING_STATS.totalRatings}
                    totalReviews={MOCK_RATING_STATS.totalReviews}
                />
            </div>

            <div className=" space-y-1 md:space-y-4">
                <h4 className=" text-base md:text-lg xl:text-xl font-bold text-gray-800">Most Helpful Review</h4>
                <ReviewItem review={mostHelpfulReview} />
            </div>

            <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-full flex items-center justify-between  px-4 md:px-6 py-2 md:py-4 border-2 border-gray-200  hover:bg-gray-50 transition-all duration-300 group"
            >
                <span className="text-sm md:text-base lg:text-lg font-bold text-gray-800">Read all Reviews</span>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>

            <ReviewDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                reviews={MOCK_REVIEWS}
                stats={MOCK_RATING_STATS}
            />
        </div>
    );
};

export default ProductReviews;
