// src/components/UI-UX/blog/BlogSidebar.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { BlogPost, blogPosts } from '@/lib/blogData';

interface BlogSidebarProps {
  onSearch?: (term: string) => void;
  activeCategory?: string;
}

export default function BlogSidebar({ onSearch, activeCategory }: BlogSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'Nutrition', count: blogPosts.filter(p => p.category === 'Nutrition').length },
    { name: 'Supplements', count: blogPosts.filter(p => p.category === 'Supplements').length },
    { name: 'Training', count: blogPosts.filter(p => p.category === 'Training').length },
    { name: 'Education', count: blogPosts.filter(p => p.category === 'Education').length },
    { name: 'Weight Loss', count: blogPosts.filter(p => p.category === 'Weight Loss').length },
  ];

  const recentPosts = blogPosts.slice(0, 3);

  const allTags = Array.from(new Set(blogPosts.flatMap(p => p.tags)));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <aside className="space-y-10">
      {/* Search Widget */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#629D23]">
          Search
        </h3>
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            placeholder="Search blogs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-[#629D23] outline-none font-medium transition-all"
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-[#629D23] transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#629D23]">
          Categories
        </h3>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link 
                href={`/blog?category=${cat.name}`} 
                className={`flex items-center justify-between text-sm font-semibold transition-colors group ${activeCategory === cat.name ? 'text-[#629D23]' : 'text-gray-600 hover:text-[#629D23]'}`}
              >
                <div className="flex items-center">
                  <ChevronRight className={`w-3 h-3 mr-2 ${activeCategory === cat.name ? 'text-[#629D23]' : 'text-gray-400 group-hover:text-[#629D23]'}`} />
                  {cat.name}
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 w-6 h-6 flex items-center justify-center rounded-full group-hover:bg-[#629D23] group-hover:text-white transition-colors">
                  {cat.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts Widget */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#629D23]">
          Recent Posts
        </h3>
        <div className="space-y-6">
          {recentPosts.map((post) => (
            <div key={post.id} className="flex items-start space-x-4 group">
              <Link href={`/blog/${post.slug}`} className="w-16 h-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100'; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#629D23] transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tag Cloud Widget */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#629D23]">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link 
              key={tag} 
              href={`/blog?tag=${tag}`}
              className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-sm border border-gray-100 hover:bg-[#629D23] hover:text-white hover:border-[#629D23] transition-all uppercase tracking-tighter"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
