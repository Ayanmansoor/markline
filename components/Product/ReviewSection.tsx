'use client'
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { getReviews } from '@/Supabase/SupabaseApi'
import { ReviewProps } from '@/types/interfaces'
import ReviewCard from './ReviewCard'
import { Star, MessageSquarePlus, Loader2 } from 'lucide-react'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import AddReviewForm from './AddReviewForm'

interface ReviewSectionProps {
    productId: number;
    productName: string;
}

function ReviewSection({ productId, productName }: ReviewSectionProps) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await mysupabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    const { data: reviews = [], isLoading, refetch } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => getReviews(productId),
        enabled: !!productId,
    });

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const renderSummaryStars = (rating: number) => {
        const numRating = Number(rating);
        return Array.from({ length: 5 }).map((_, i) => (
            <Star 
                key={i} 
                size={20} 
                className={`${i < Math.floor(numRating) ? 'text-black fill-black' : 'text-gray-200'} transition-colors`}
            />
        ));
    };

    return (
        <section className="w-full bg-white border-t border-gray-100 mt-20 pt-20 pb-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                {/* Left: Summary & CTA */}
                <div className="lg:w-80 shrink-0 space-y-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Customer Intelligence</span>
                        <h3 className="text-3xl font-black text-black uppercase tracking-tighter italic leading-none">
                            Reviews & <br /> Ratings
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black tracking-tighter italic">{averageRating}</span>
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">OUT OF 5.0</span>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                {renderSummaryStars(Number(averageRating))}
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                Based on {reviews.length} documented experiences
                            </p>
                        </div>
                    </div>

                    {user ? (
                        <AddReviewForm 
                            productId={productId} 
                            userId={user.id} 
                            productName={productName}
                            onSuccess={() => refetch()}
                        >
                            <button className="w-full group bg-black text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-gray-900 active:scale-95 flex items-center justify-center gap-2">
                                <MessageSquarePlus size={16} className="transition-transform group-hover:rotate-12" />
                                Write a Review
                            </button>
                        </AddReviewForm>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                                Authorisation required <br /> to post a review
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Review List */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 size={32} className="animate-spin text-gray-200" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accessing Registry...</span>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-0">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} {...review} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 gap-6">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Star className="text-gray-200" size={32} />
                            </div>
                            <div className="text-center space-y-2 px-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 italic">No Public Manifests</h4>
                                <p className="text-[11px] text-gray-400 font-medium max-w-sm mx-auto uppercase leading-relaxed tracking-wider">
                                    Be the first to document your experience with this acquisition. 
                                    Your perspective validates our dedication to craftsmanship.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ReviewSection
