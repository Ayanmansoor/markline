import React, { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import ReviewSummary from './ReviewSummary';
import RatingBars from './RatingBars';
import ReviewItem from './ReviewItem';
import { Review, RatingStats } from './data';
import { mysupabase } from '@/Supabase/SupabaseConfig';
import AddReviewForm from '../AddReviewForm';
import { Plus } from 'lucide-react';

interface ReviewDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    reviews: Review[];
    stats: RatingStats;
    productId: number;
    productName: string;
    onSuccess?: () => void;
}

const ReviewDrawer: React.FC<ReviewDrawerProps> = ({ isOpen, onClose, reviews, stats, productId, productName, onSuccess }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await mysupabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full max-w-[320px] sm:max-w-[500px] p-0 flex flex-col gap-0 border-l-0 sm:border-l">
                {/* Header */}
                <SheetHeader className="px-4 md:px-6 py-2 md:py-4 border-b space-y-0 text-left sm:text-left">
                    <SheetTitle className="text-sm md:text-base lg:text-xl font-bold text-gray-900 text-center">
                        All Reviews
                    </SheetTitle>
                </SheetHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="mb-8  p-2 md:p-4 border rounded-xl bg-gray-50/50">
                        <ReviewSummary
                            averageRating={stats.averageRating}
                            totalRatings={stats.totalRatings}
                            totalReviews={stats.totalReviews}
                        />

                        <div className="mt-6">
                            {user ? (
                                <AddReviewForm 
                                    productId={productId} 
                                    userId={user.id} 
                                    productName={productName}
                                    onSuccess={() => {
                                        onSuccess?.();
                                        onClose();
                                    }}
                                >
                                    <button className="w-full bg-black text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                                        <Plus size={14} />
                                        Write a Review
                                    </button>
                                </AddReviewForm>
                            ) : (
                                <div className="p-3 bg-white border border-gray-100 rounded-lg text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Login to document your experience</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 border-t pt-2 md:hidden">
                            <RatingBars
                                distribution={stats.distribution}
                                total={stats.totalRatings}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <ReviewItem key={review.id} review={review} />
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No Public Manifests found</p>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ReviewDrawer;
