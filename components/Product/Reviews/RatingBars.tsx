import React from 'react';
import { Star } from 'lucide-react';

interface RatingBarsProps {
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    total: number;
}

const RatingBars: React.FC<RatingBarsProps> = ({ distribution, total }) => {
    const ratings = [5, 4, 3, 2, 1] as const;

    return (
        <div className="space-y-3 py-4">
            {ratings.map((rating) => {
                const count = distribution[rating];
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                    <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-8">
                            <span className="text-sm font-medium text-gray-600">{rating}</span>
                            <Star className="w-4 h-4 fill-gray-400 text-gray-400" />
                        </div>

                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gray-700 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>

                        <div className="w-6 text-right">
                            <span className="text-sm font-medium text-gray-500">{count}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RatingBars;
