// src/components/UI-UX/blog/BlogHeader.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BlogHeaderProps {
  title: string;
  breadcrumb?: { name: string; href: string }[];
}

export default function BlogHeader({ title, breadcrumb }: BlogHeaderProps) {
  return (
    <section className="bg-gray-100 py-12 md:py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470')" }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-wider">{title}</h1>
        <nav className="flex justify-center items-center space-x-2 text-white/80 text-sm md:text-base font-medium">
          <Link href="/" className="hover:text-[#629D23] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          {breadcrumb ? (
            breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                <Link href={item.href} className="hover:text-[#629D23] transition-colors">{item.name}</Link>
                {index < breadcrumb.length - 1 && <ChevronRight className="w-4 h-4" />}
              </React.Fragment>
            ))
          ) : (
            <span className="text-[#629D23]">Blog</span>
          )}
        </nav>
      </div>
    </section>
  );
}
