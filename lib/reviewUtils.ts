import { ReviewProps } from "@/types/interfaces";
import { Review, RatingStats } from "@/components/Product/Reviews/data";

export const calculateRatingStats = (reviews: ReviewProps[]): RatingStats => {
    const totalReviews = reviews.length;
    const distribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    let totalRatingSum = 0;

    reviews.forEach((review) => {
        const r = review.rating as keyof typeof distribution;
        if (distribution[r] !== undefined) {
            distribution[r]++;
            totalRatingSum += r;
        }
    });

    const averageRating = totalReviews > 0 ? Number((totalRatingSum / totalReviews).toFixed(1)) : 0;

    return {
        averageRating,
        totalRatings: totalReviews,
        totalReviews,
        distribution,
    };
};

export const mapSupabaseReviewToUI = (review: ReviewProps): Review => {
    return {
        id: review.id.toString(),
        userName: review.user?.name || "Verified Customer",
        rating: review.rating,
        date: review.created_at ? new Intl.DateTimeFormat('en-GB').format(new Date(review.created_at)) : "Recently",
        title: review.title,
        comment: review.comment,
        isVerified: !!review.is_verified,
        helpfulCount: review.likes || 0,
        imageUrls: review.image_urls || [],
    };
};
