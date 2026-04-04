'use client'
import React from 'react'
import { ReviewProps } from '@/types/interfaces'
import { Star, CheckCircle2, ThumbsUp } from 'lucide-react'

function ReviewCard({ rating, title, comment, created_at, is_verified, likes, user, image_urls }: ReviewProps) {
    const renderStars = (count: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star 
                key={i} 
                size={14} 
                className={`${i < count ? 'text-black fill-black' : 'text-gray-200'} transition-colors`}
            />
        ));
    };

    return (
        <div className="w-full bg-white border-b border-gray-100 py-8 first:pt-0 last:border-0 last:pb-0">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                {/* Left: Metadata */}
                <div className="w-full md:w-48 shrink-0 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm overflow-hidden">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="uppercase">{user?.name?.charAt(0) || 'C'}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-tighter italic leading-none">
                                {user?.name || "Verified Customer"}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                {created_at ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(created_at)) : 'Recently'}
                            </span>
                        </div>
                    </div>

                    {is_verified && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full">
                            <CheckCircle2 size={10} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified Purchase</span>
                        </div>
                    )}
                </div>

                {/* Right: Content */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-1">
                        {renderStars(rating)}
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-base font-black uppercase tracking-tight italic leading-tight">
                            {title}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-2xl">
                            {comment}
                        </p>
                    </div>

                    {/* Images if any */}
                    {image_urls && image_urls.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {image_urls.map((url, idx) => (
                                <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-zoom-in">
                                    <img 
                                        src={url} 
                                        alt={`Review image ${idx + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <button className="flex items-center gap-2 group">
                            <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                <ThumbsUp size={12} className="text-gray-400 group-hover:text-black" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                                Helpful ({likes || 0})
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard
