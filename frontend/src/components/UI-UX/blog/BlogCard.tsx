// src/components/UI-UX/blog/BlogCard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/blogData';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
      <div className="relative overflow-hidden h-64">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400'; }}
        />
        <div className="absolute top-4 left-4 bg-[#629D23] text-white text-xs font-bold px-3 py-1 uppercase rounded-sm">
          {post.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4 font-medium uppercase tracking-tight">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#629D23]" />
            {post.date}
          </div>
          <div className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1.5 text-[#629D23]" />
            {post.author}
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#629D23] transition-colors leading-tight">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="mt-auto">
          <Link 
            href={`/blog/${post.slug}`} 
            className="inline-flex items-center text-[#629D23] font-bold text-sm uppercase tracking-wider group/btn"
          >
            Read More 
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
