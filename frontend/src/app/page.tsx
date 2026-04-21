"use client";
import Header from "@/components/UI-UX/common/Header";
import HeroSection from "@/components/UI-UX/common/HeroSection";
import FeaturedProducts from "@/components/UI-UX/common/FeaturedProducts";
import ExclusiveItems from "@/components/UI-UX/common/ExclusiveItems";
import TestimonialSection from "@/components/UI-UX/common/Testimonial";
import ProductCategoryQueue from "@/components/UI-UX/common/ProductCategoryQueue";
import Footer from "@/components/UI-UX/common/Footer";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    console.log('=== API DEBUG START ===');
    console.log('Frontend URL:', window.location.origin);
    console.log('Backend URL:', process.env.NEXT_PUBLIC_API_URL);
    
    // Test call
    fetch('https://supplimax-back-production.up.railway.app/products')
      .then(res => {
        console.log('Fetch Status:', res.status);
        console.log('CORS Header:', res.headers.get('access-control-allow-origin'));
        return res.ok ? res.json() : Promise.reject(res);
      })
      .then(data => console.log('Success! Data length:', data.length))
      .catch(err => console.error('Failed! Error:', err.statusText || err.message));
  }, []);

  return (
    <div className="bg-gray-200 h-auto">
      <Header/>
      <HeroSection />
      <ProductCategoryQueue /> 
      <FeaturedProducts />
      <ExclusiveItems/>
      <TestimonialSection />
      <Footer/>
    </div>
  );
}