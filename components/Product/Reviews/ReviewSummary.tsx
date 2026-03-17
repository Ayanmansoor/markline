import React from 'react';
import { Star } from 'lucide-react';

interface ReviewSummaryProps {
    averageRating: number;
    totalRatings: number;
    totalReviews: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ averageRating, totalRatings, totalReviews }) => {
    return (
        <div className="flex items-center justify-between border border-gray-150 rounded-lg p-3 md:p-4 xl:p-6 bg-white shadow-sm   ">
            <div className="flex items-center gap-2">
                <span className="text-4xl md:text-5xl font-bold text-primary">{averageRating}</span>
                <Star className=" w-8 h-4  md:w-8 md:h-8 xl:w-10 xl:h-10 fill-primary text-primary" />
            </div>

            <div className="h-12 w-[1px] bg-gray-200 hidden sm:block"></div>

            <div className="flex flex-col items-center sm:items-start">
                <span className="text-xl md:text-2xl font-bold text-primary">{totalRatings}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">Ratings</span>
            </div>

            <div className="h-12 w-[1px] bg-gray-200 hidden sm:block"></div>

            <div className="flex flex-col items-center sm:items-start text-right sm:text-left">
                <span className="text-xl md:text-2xl font-bold text-primary">{totalReviews}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">Reviews</span>
            </div>
        </div>
    );
};

export default ReviewSummary;
