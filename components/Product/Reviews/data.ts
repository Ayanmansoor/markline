export interface Review {
    id: string;
    userName: string;
    rating: number;
    date: string;
    title?: string;
    comment: string;
    isVerified: boolean;
    helpfulCount: number;
    imageUrls?: string[];
}

export interface RatingStats {
    averageRating: number;
    totalRatings: number;
    totalReviews: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        userName: 'Anonymous',
        rating: 5,
        date: '22/09/2025',
        comment: 'Very good quality I liked it. Perfectly matched with image.',
        isVerified: true,
        helpfulCount: 12,
    },
    {
        id: '2',
        userName: 'Srishti Sharma',
        rating: 1,
        date: '27/01/2025',
        comment: 'Nice product',
        isVerified: true,
        helpfulCount: 2,
    },
    {
        id: '3',
        userName: 'Ayaan Ahmad',
        rating: 4,
        date: '10/02/2025',
        comment: 'The quality is superb, but delivery took a bit long.',
        isVerified: true,
        helpfulCount: 5,
    },
    {
        id: '4',
        userName: 'Riya Patel',
        rating: 5,
        date: '05/03/2025',
        comment: 'Absolutely love the color and fit!',
        isVerified: true,
        helpfulCount: 8,
    }
];

export const MOCK_RATING_STATS: RatingStats = {
    averageRating: 4.3,
    totalRatings: 38,
    totalReviews: 4,
    distribution: {
        5: 27,
        4: 5,
        3: 0,
        2: 2,
        1: 4,
    },
};
