'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blogData';

export default function BlogSection() {
  // Use the first 3 blog posts from our library
  const displayBlogs = blogPosts.slice(0, 3);

  return (
    <section className="container mx-auto px-4 py-16 border-t border-gray-100">
      <div className="text-center mb-12">
        <p className="text-[#629D23] font-bold uppercase tracking-widest mb-2 text-sm">Read Our Blog</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase">News Tips & Tricks</h2>
        <div className="w-16 h-1 bg-[#629D23] mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {displayBlogs.map((blog) => (
          <div key={blog.id} className="group cursor-pointer">
            <Link href={`/blog/${blog.slug}`}>
              <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/3]">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400'; }}
                />
                <div className="absolute top-4 left-4 bg-[#629D23] text-white text-xs font-bold uppercase px-3 py-1 rounded-sm">
                  {blog.category}
                </div>
              </div>
            </Link>
            <div className="text-sm text-gray-500 mb-2">{blog.date}</div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#629D23] transition-colors mb-3">
              <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
            </h3>
            <Link 
              href={`/blog/${blog.slug}`}
              className="inline-flex items-center text-[#629D23] font-bold text-sm uppercase group-hover:underline"
            >
              Read More <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link 
          href="/blog"
          className="px-10 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-full hover:bg-[#629D23] transition-colors duration-300 shadow-lg"
        >
          View All Posts
        </Link>
      </div>
    </section>
  );
}
