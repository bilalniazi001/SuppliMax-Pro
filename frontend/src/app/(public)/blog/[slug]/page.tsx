// src/app/(public)/blog/[slug]/page.tsx
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Tag
} from 'lucide-react';
import BlogHeader from '@/components/UI-UX/blog/BlogHeader';
import BlogSidebar from '@/components/UI-UX/blog/BlogSidebar';
import BlogCard from '@/components/UI-UX/blog/BlogCard';
import { blogPosts } from '@/lib/blogData';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts.find(p => p.slug === slug);
  
  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">The blog post you are looking for might have been moved or deleted.</p>
        <Link href="/blog" className="px-8 py-3 bg-[#629D23] text-white font-bold rounded hover:bg-[#2D3B29] transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Social share links
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  return (
    <>
      <BlogHeader 
        title="Blog Details" 
        breadcrumb={[
          { name: 'Blog', href: '/blog' },
          { name: post.category, href: `/blog?category=${post.category}` }
        ]} 
      />
      
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-8/12">
              <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Featured Image */}
                <div className="h-[300px] md:h-[500px] relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800'; }}
                  />
                  <div className="absolute top-6 left-6 bg-[#629D23] text-white text-xs font-bold px-4 py-1.5 uppercase rounded-sm shadow-lg">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 font-semibold border-b border-gray-100 pb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#629D23]" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-[#629D23]" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-[#629D23]" />
                      0 Comments
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                    {post.title}
                  </h1>

                  {/* Body Content */}
                  <div 
                    className="blog-content text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Tags and Share */}
                  <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-4 h-4 text-[#629D23] mr-1" />
                      <span className="text-sm font-bold text-gray-900 mr-2 uppercase tracking-wider">Tags:</span>
                      {post.tags.map(tag => (
                        <Link 
                          key={tag} 
                          href={`/blog?tag=${tag}`}
                          className="text-xs text-gray-500 hover:text-[#629D23] transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Share:</span>
                      <div className="flex space-x-2">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-[#629D23] hover:text-white transition-all">
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-[#629D23] hover:text-white transition-all">
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-[#629D23] hover:text-white transition-all">
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-[#629D23] hover:text-white transition-all">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Prev/Next Post */}
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="flex-1 bg-white p-6 rounded-lg border border-gray-100 flex items-center group hover:border-[#629D23] transition-all">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#629D23] group-hover:text-white transition-all mr-4">
                      <ChevronLeft className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previous Post</span>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#629D23] transition-colors truncate max-w-[200px]">{prevPost.title}</h4>
                    </div>
                  </Link>
                ) : (
                  <Link href="/blog" className="flex-1 bg-white p-6 rounded-lg border border-gray-100 flex items-center group hover:border-[#629D23] transition-all">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#629D23] group-hover:text-white transition-all mr-4">
                      <ChevronLeft className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previous</span>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#629D23] transition-colors truncate max-w-[200px]">Back to Blog</h4>
                    </div>
                  </Link>
                )}

                {nextPost ? (
                  <Link href={`/blog/${nextPost.slug}`} className="flex-1 bg-white p-6 rounded-lg border border-gray-100 flex items-center justify-end group hover:border-[#629D23] transition-all text-right">
                    <div className="mr-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Post</span>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#629D23] transition-colors truncate max-w-[200px]">{nextPost.title}</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#629D23] group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Link>
                ) : (
                  <Link href="/blog" className="flex-1 bg-white p-6 rounded-lg border border-gray-100 flex items-center justify-end group hover:border-[#629D23] transition-all text-right">
                    <div className="mr-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next</span>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#629D23] transition-colors truncate max-w-[200px]">All Posts</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#629D23] group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Link>
                )}
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wider relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#629D23]">
                    Related Posts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPosts.map(p => (
                      <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group">
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={p.image} 
                            alt={p.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=300'; }}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#629D23] transition-colors leading-tight mb-2 line-clamp-2">
                            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                          </h4>
                          <span className="text-[10px] font-bold text-[#629D23] uppercase tracking-widest">{p.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-4/12">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
