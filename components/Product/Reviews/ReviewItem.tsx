import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp } from 'lucide-react';
import { Review } from './data';

interface ReviewItemProps {
    review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
    const [helpful, setHelpful] = useState(false);

    return (
        <div className="py-6 border-b border-gray-100 last:border-0">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 text-base">{review.userName}</h4>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                    <span className="text-sm font-bold text-gray-900">{review.rating}</span>
                    <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                {review.isVerified && (
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified buyer</span>
                    </div>
                )}
                <span>•</span>
                <span>Reviewed on: {review.date}</span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-gray-900 text-sm font-medium leading-relaxed">
                    {review.comment}
                </p>
            </div>

            <button
                onClick={() => setHelpful(!helpful)}
                className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-md transition-colors ${helpful
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
            >
                <ThumbsUp className={`w-4 h-4 ${helpful ? 'fill-white' : ''}`} />
                <span>Helpful</span>
            </button>
        </div>
    );
};

export default ReviewItem;
