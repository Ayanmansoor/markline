'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { BlogCardProps } from '@/types/interfaces'
import { ArrowUpRight, Calendar, BookOpen } from 'lucide-react'

interface BlogCardData {
  data: BlogCardProps;
}

const FALLBACK_IMAGE = '/blogbanner.avif';

function formatDate(dateString?: string) {
  if (!dateString) return 'Editorial';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Editorial';
  }
}

function BlogCard({ data }: BlogCardData) {
  const [imgSrc, setImgSrc] = useState(
    data.image || data.bannerImage || FALLBACK_IMAGE
  );

  const description = data.discription || data.seoDescription || '';
  const dateFormatted = formatDate(data.created_at);

  return (
    <Link
      href={`/blogs/${data.slug}`}
      className="group relative w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden"
    >
      <div>
        {/* Cover Image */}
        <div className="relative w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden bg-slate-100 mb-4">
          <img
            src={imgSrc}
            alt={data.title || 'Markline Journal'}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
            Journal
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 font-medium mb-2">
          <Calendar className="w-3 h-3 text-amber-600" />
          <span>{dateFormatted}</span>
          <span>•</span>
          <BookOpen className="w-3 h-3 text-amber-600" />
          <span>Style Guide</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
          {data.title}
        </h3>

        {/* Excerpt */}
        {description && (
          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
          Read Story
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </Link>
  );
}

export default BlogCard;