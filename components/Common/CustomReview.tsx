import React from 'react';
import { Star, StarHalf } from 'lucide-react'; // Make sure this is imported

const getRandomRating = () => {
    const min = 1;
    const max = 5;
    const rating = (Math.random() * (max - min) + min).toFixed(1);
    return parseFloat(rating);
};

const CustomReview = () => {
    const rating = getRandomRating();
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.2 && rating % 1 < 0.8;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // 💡 FIX: Explicitly type the array to accept React elements (JSX)
    const stars: React.ReactNode[] = [];

    // Add Full Stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} className="w-5 h-5 fill-yellow-500 text-yellow-500" />);
    }

    // Add Half Star (if applicable)
    if (hasHalfStar) {
        stars.push(<StarHalf key="half" className="w-5 h-5 fill-yellow-500 text-yellow-500" />);
    }

    // Add Empty Stars
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return (
        <div className="flex items-center space-x-0.5">
            {stars}
            <span className="ml-2 text-lg font-semibold text-gray-700">
                {rating} / 5
            </span>
        </div>
    );
};

export default CustomReview;