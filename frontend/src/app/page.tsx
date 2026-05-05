"use client";
import { API_BASE_URL } from '@/config';
import Header from "@/components/UI-UX/common/Header";
import HeroSection from "@/components/UI-UX/common/HeroSection";
import BrandSlider from "@/components/UI-UX/common/BrandSlider";
import ProductCategoryQueue from "@/components/UI-UX/common/ProductCategoryQueue";
import PromoBanners from "@/components/UI-UX/common/PromoBanners";
import DealOfTheDay from "@/components/UI-UX/common/DealOfTheDay";
import CategoryProductsSection from "@/components/UI-UX/common/CategoryProductsSection";
import BlogSection from "@/components/UI-UX/common/BlogSection";
import TestimonialSection from "@/components/UI-UX/common/Testimonial";
import Footer from "@/components/UI-UX/common/Footer";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Basic connectivity check (optional)
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header/>
      <HeroSection />
      <ProductCategoryQueue /> 
      <PromoBanners />
      <DealOfTheDay />
      <CategoryProductsSection />
      <BlogSection />
      <BrandSlider />
      <TestimonialSection />
      <Footer/>
    </div>
  );
}
