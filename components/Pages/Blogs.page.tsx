'use client'
import React, { useState, useMemo } from 'react'
import BlogCard from '../Blogs/BlogCard'
import { useQuery } from 'react-query'
import { getAllBlogs } from '@/Supabase/SupabaseApi'
import { BlogCardProps } from '@/types/interfaces'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Search,
  BookOpen,
  Mail
} from 'lucide-react'

interface BlogsPageProps {
  initialBlogs?: BlogCardProps[];
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Articles' },
  { id: 'TRENDS', label: 'Style & Trends' },
  { id: 'CARE', label: 'Footwear Care' },
  { id: 'GUIDE', label: 'Buying Guides' },
];

function BlogsPage({ initialBlogs = [] }: BlogsPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');

  const {
    data: blogs = initialBlogs,
    isLoading: blogLoading,
  } = useQuery<BlogCardProps[]>({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
    initialData: initialBlogs.length > 0 ? initialBlogs : undefined,
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const blogList = Array.isArray(blogs) ? blogs : [];

  // Filter blogs based on search and topic
  const filteredBlogs = useMemo(() => {
    let list = [...blogList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((b) => {
        const title = (b.title || '').toLowerCase();
        const desc = (b.discription || b.seoDescription || '').toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    if (selectedTopic !== 'ALL') {
      const topic = selectedTopic.toLowerCase();
      list = list.filter((b) => {
        const title = (b.title || '').toLowerCase();
        const desc = (b.discription || '').toLowerCase();
        if (topic === 'trends') return title.includes('trend') || title.includes('fashion') || desc.includes('style');
        if (topic === 'care') return title.includes('care') || title.includes('clean') || desc.includes('leather');
        if (topic === 'guide') return title.includes('guide') || title.includes('what') || title.includes('difference');
        return true;
      });
    }

    return list;
  }, [blogList, searchQuery, selectedTopic]);

  return (
    <main className="w-full bg-[#FCFCFC] text-slate-900 overflow-hidden font-sans pb-20">
      {/* 1. Editorial Header Section */}
      <section className="relative w-full bg-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-12 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-3"
          >
            The Journal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-light leading-relaxed mb-8 font-serif italic"
          >
            Essays on contemporary footwear aesthetics, leather craftsmanship, runway trends, and mindful styling.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-lg relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or keyword..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Topic Filter Tabs Bar */}
      <section className="w-full bg-white border-b border-slate-200 sticky top-16 z-20 py-3 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedTopic(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${selectedTopic === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block shrink-0">
            Showing <strong className="text-slate-900">{filteredBlogs.length}</strong> {filteredBlogs.length === 1 ? 'Article' : 'Articles'}
          </div>
        </div>
      </section>

      {/* 3. All Articles Grid */}
      <section className="max-w-7xl mx-auto  px-4  pt-8 sm:pt-12">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Stories & Guides
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Markline Archive
          </span>
        </div>

        {blogLoading && initialBlogs.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="w-full h-[320px] rounded-2xl bg-slate-200 animate-pulse" />
            <div className="w-full h-[320px] rounded-2xl bg-slate-200 animate-pulse" />
            <div className="w-full h-[320px] rounded-2xl bg-slate-200 animate-pulse" />
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((item: BlogCardProps, index: number) => (
              <BlogCard data={item} key={item.id || item.slug || index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">No Articles Found</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">
              {searchQuery
                ? `No stories found matching "${searchQuery}". Try a different keyword or explore all articles.`
                : 'Our editorial team is crafting new essays. Please check back soon.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTopic('ALL');
                }}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-full hover:bg-black transition-colors"
              >
                Reset Search
              </button>
            )}
          </div>
        )}
      </section>

      {/* 4. Newsletter Subscription Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Markline Atelier Dispatch</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
            Subscribe to the Journal
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-light leading-relaxed mb-6">
            Receive curated styling guides, seasonal drop alerts, and bespoke shoe care tutorials directly in your inbox.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to the Markline Journal!');
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="w-full px-5 py-3 rounded-full bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 bg-white text-slate-900 rounded-full text-xs sm:text-sm font-bold tracking-wider hover:bg-amber-300 transition-colors shrink-0 cursor-pointer shadow-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default BlogsPage;