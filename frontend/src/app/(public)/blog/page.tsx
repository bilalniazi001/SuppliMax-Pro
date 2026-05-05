// src/app/(public)/blog/page.tsx
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogHeader from '@/components/UI-UX/blog/BlogHeader';
import BlogCard from '@/components/UI-UX/blog/BlogCard';
import BlogSidebar from '@/components/UI-UX/blog/BlogSidebar';
import { blogPosts, BlogPost } from '@/lib/blogData';

function BlogListContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');
  
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let results = blogPosts;

    if (categoryParam) {
      results = results.filter(post => post.category === categoryParam);
    }

    if (tagParam) {
      results = results.filter(post => post.tags.includes(tagParam));
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(lowerTerm) || 
        post.excerpt.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredPosts(results);
  }, [categoryParam, tagParam, searchTerm]);

  return (
    <>
      <BlogHeader title={categoryParam ? `Category: ${categoryParam}` : tagParam ? `Tag: ${tagParam}` : "SuppliMax Blog"} />
      
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-8/12">
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-lg text-center shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h3>
                  <p className="text-gray-500">We couldn't find any blog posts matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      window.history.pushState({}, '', '/blog');
                    }}
                    className="mt-6 px-6 py-2 bg-[#629D23] text-white font-bold rounded hover:bg-[#2D3B29] transition-colors"
                  >
                    View All Posts
                  </button>
                </div>
              )}

              {/* Pagination (Static for now) */}
              {filteredPosts.length > 0 && (
                <div className="mt-12 flex justify-center space-x-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 font-bold hover:bg-[#629D23] hover:text-white transition-all">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 font-bold hover:bg-[#629D23] hover:text-white transition-all">2</button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-4/12">
              <BlogSidebar 
                onSearch={(term) => setSearchTerm(term)} 
                activeCategory={categoryParam || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Blog...</div>}>
      <BlogListContent />
    </Suspense>
  );
}
