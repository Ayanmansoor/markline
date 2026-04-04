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

            <div className="space-y-4 mb-4">
                {review.title && (
                    <h5 className="text-sm font-bold text-gray-900 uppercase tracking-tight italic">
                        {review.title}
                    </h5>
                )}
                <p className="text-gray-900 text-sm font-medium leading-relaxed">
                    {review.comment}
                </p>

                {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {review.imageUrls.map((url, i) => (
                            <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                                <img 
                                    src={url} 
                                    alt={`Review asset ${i + 1}`} 
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                                />
                            </div>
                        ))}
                    </div>
                )}
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
