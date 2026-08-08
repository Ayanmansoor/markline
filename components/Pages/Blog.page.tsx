'use client'
import React, { useState } from 'react'
import { getblog } from '@/Supabase/SupabaseApi'
import { useQuery } from 'react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  BookOpen,
  ChevronRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react'
import { BlogDetailProps, NewProductProps, BlogCardProps } from '@/types/interfaces'
import ProductCard from '../Common/ProductCard'
import BlogCard from '../Blogs/BlogCard'

interface BlogPageProps {
  initialBlog?: BlogDetailProps | null;
  slug?: string;
}

const FALLBACK_IMAGE = '/blogbanner.avif';

function formatDate(dateString?: string) {
  if (!dateString) return 'Editorial';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Editorial';
  }
}

function BlogPage({ initialBlog, slug: propSlug }: BlogPageProps) {
  const params = useParams();
  const slugParam = propSlug || (params?.slug as string);
  const blogslug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const {
    data: blog = initialBlog,
    isLoading,
  } = useQuery<BlogDetailProps | null>({
    queryKey: ["blog", blogslug],
    queryFn: () => getblog(blogslug),
    initialData: initialBlog || undefined,
    enabled: !!blogslug,
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [imgSrc, setImgSrc] = useState<string>(
    blog?.bannerImage || blog?.image || FALLBACK_IMAGE
  );

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: blog?.title || 'Markline Journal',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  if (isLoading && !blog) {
    return (
      <main className="w-full min-h-screen bg-[#FCFCFC] py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="w-32 h-6 bg-slate-200 rounded-full" />
          <div className="w-full h-12 bg-slate-200 rounded-xl" />
          <div className="w-full h-[400px] bg-slate-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="w-full h-4 bg-slate-200 rounded" />
            <div className="w-5/6 h-4 bg-slate-200 rounded" />
            <div className="w-4/6 h-4 bg-slate-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#FCFCFC] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md">
          The story you are looking for might have been moved or updated.
        </p>
        <Link
          href="/blogs"
          className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold tracking-wide hover:bg-black transition-colors"
        >
          Return to Journal
        </Link>
      </main>
    );
  }

  const dateFormatted = formatDate(blog.created_at);
  const products = blog.products || [];
  const relatedBlogs = blog.relatedBlogs || [];

  return (
    <article className="w-full bg-[#FCFCFC] text-slate-900 overflow-hidden font-sans selection:bg-black selection:text-white pb-24">
      {/* 1. Top Breadcrumbs & Meta Header */}
      <header className="w-full bg-slate-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/blogs" className="hover:text-white transition-colors">
              Journal
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 truncate max-w-[200px] sm:max-w-xs">
              {blog.title}
            </span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            {blog.title}
          </h1>

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-medium text-white">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-xs">
                  M
                </span>
                <span>Markline Atelier</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{dateFormatted}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>4 Min Read</span>
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Cover Image */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="relative w-full h-[280px] sm:h-[420px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-100 border border-slate-200">
          <img
            src={imgSrc}
            alt={blog.title || 'Markline Article Cover'}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* 3. Article Body Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {blog.discription && (
          <p className="text-lg sm:text-xl font-light text-slate-700 leading-relaxed font-serif italic border-l-4 border-amber-600 pl-5 mb-8">
            {blog.discription}
          </p>
        )}

        {/* HTML Article Content with prose styling */}
        <div
          className="prose prose-slate sm:prose-lg max-w-none text-slate-800 leading-relaxed space-y-5
            [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:tracking-tight [&>h2]:mt-8 [&>h2]:mb-3
            [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-6 [&>h3]:mb-2
            [&>p]:text-base [&>p]:sm:text-lg [&>p]:font-light [&>p]:leading-relaxed [&>p]:text-slate-700
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:text-slate-700
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:text-slate-700
            [&>blockquote]:border-l-4 [&>blockquote]:border-amber-600 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600
            [&>img]:rounded-2xl [&>img]:shadow-lg [&>img]:my-6 [&>img]:w-full [&>img]:object-cover"
          dangerouslySetInnerHTML={{
            __html: blog.content || `<p>${blog.discription || 'Article details coming soon.'}</p>`,
          }}
        />

        {/* Author Bio Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-300 font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
            M
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Markline Editorial Team
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-3">
              Crafted in Mumbai & inspired by modern luxury fashion. Our editorial team investigates ergonomic footwear engineering, leather craftsmanship, and contemporary style trends.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-amber-700">
              <Link href="/blogs" className="hover:underline">
                View All Journal Articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured / Related Products Mentioned in this Blog */}
      {products.length > 0 && (
        <section className="w-full bg-slate-50 border-y border-slate-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 my-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-amber-700 block mb-1">
                  Shop The Story
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Featured Products
                </h3>
              </div>
              <Link
                href="/products/women"
                className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-700 inline-flex items-center gap-1 transition-colors"
              >
                <span>View All Footwear</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 4).map((product: NewProductProps, idx: number) => (
                <div key={product.id || idx} className="h-full">
                  <ProductCard
                    className="h-[260px] xs:h-[300px] sm:h-[350px] md:h-[380px]"
                    product={product}
                    url="product"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Related Articles & Guides */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-amber-700 block mb-1">
                More From The Journal
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Related Articles & Guides
              </h3>
            </div>
            <Link
              href="/blogs"
              className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>Explore All Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedBlogs.map((item: BlogCardProps, idx: number) => (
              <BlogCard data={item} key={item.id || item.slug || idx} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Navigation Footer Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-slate-900 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-slate-900 hover:text-amber-700 transition-colors"
          >
            <span>Explore New Arrivals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}

export default BlogPage;