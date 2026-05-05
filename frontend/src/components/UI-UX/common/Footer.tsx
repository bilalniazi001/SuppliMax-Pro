'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Clock, DollarSign, RefreshCw, Headset, Percent } from 'lucide-react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

// --- DATA ---

const FEATURE_DATA = [
  { icon: DollarSign, title: 'Best Prices & Offers', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
  { icon: RefreshCw, title: '100% Return Policy', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
  { icon: Headset, title: 'Support 24/7', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
  { icon: Percent, title: 'Great Offer Daily Deal', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
];

const QUICK_LINKS = [
  {
    title: 'Our Stores',
    links: [
      { label: 'Delivery Information', href: '/orders' },
      { label: 'Privacy Policy', href: '/faq' },
      { label: 'Terms & Conditions', href: '/faq' },
      { label: 'Support Center', href: '/contacts' },
      { label: 'Careers', href: '/contacts' },
    ],
  },
  {
    title: 'Shop Categories',
    links: [
      { label: 'Contact Us', href: '/contacts' },
      { label: 'Information', href: '/blog' },
      { label: 'About Us', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Next Stories', href: '/blog' },
    ],
  },
  {
    title: 'Useful Links',
    links: [
      { label: 'Cancellation & Returns', href: '/orders' },
      { label: 'Payments', href: '/orders' },
      { label: 'Shipping', href: '/orders' },
      { label: 'Report Infringement', href: '/contacts' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];

// --- COMPONENTS ---

const FeatureItem: React.FC<{ icon: any, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center p-2">
      <Icon size={24} className="text-white" />
    </div>
    <div className="text-white">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm opacity-90">{desc}</p>
    </div>
  </div>
);

/**
 * Main Footer Component
 */
export default function Footer() {
  
  const GREEN_COLOR = 'bg-[#629D23]';
  const LIGHT_BG = 'bg-gray-50';
  const BORDER_COLOR = 'border-gray-200';
  const TEXT_COLOR = 'text-[#2D3B29]'; // Updated text color
  const HOVER_COLOR = 'text-[#629D23]';

  return (
    <footer className="w-full">

      {/* 1. Top Bar (Features Section) - Green Background */}
      <div className={`${GREEN_COLOR} py-8 md:py-10`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURE_DATA.map((item, index) => (
              <FeatureItem key={index} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Content Section */}
      <div className={`${LIGHT_BG} py-12 md:py-16`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-10 lg:gap-8">

            {/* Column 1: About Company */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className={`text-lg font-bold mb-4 ${TEXT_COLOR}`}>About Company</h3>
              
              <div className="space-y-4 text-sm">
                <p className={`${TEXT_COLOR} leading-relaxed`}>
                  SuppliMax is your trusted marketplace for premium quality products. We bridge the gap between quality producers and conscious consumers.
                </p>

                <div className="flex items-start gap-2">
                  <Mail size={16} className="text-[#629D23] mt-0.5 flex-shrink-0" />
                  <span className={TEXT_COLOR}>bilalkhanniazi765@gmail.com</span>
                </div>

                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-[#629D23] mt-0.5 flex-shrink-0" />
                  <span className="text-xl font-bold text-green-600">+92 321 5464 895</span>
                </div>

                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#629D23] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className={`${TEXT_COLOR} font-semibold`}>24/7 Available</span>
                  </div>
                </div>

                <div className={`${TEXT_COLOR} leading-relaxed`}>
                  <p className="font-semibold">95 street Faisal Town, West Canal Road</p>
                  <p>Faisalabad, Punjab, Pakistan</p>
                </div>
              </div>
            </div>

            {/* Columns 2, 3, 4: Quick Links */}
            {QUICK_LINKS.map((section, index) => (
              <div key={index} className="col-span-1">
                <h3 className={`text-lg font-bold mb-4 ${TEXT_COLOR}`}>{section.title}</h3>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="text-[#629D23] hover:text-[#2D3B29] transition duration-150">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 5: Our Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className={`text-lg font-bold mb-4 ${TEXT_COLOR}`}>Our Newsletter</h3>
              <p className={`text-sm ${TEXT_COLOR} mb-4`}>
                Subscribe to the mailing list to receive updates one the new arrivals and other discounts
              </p>
              
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="p-3 w-full border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#629D23] focus:border-[#629D23]"
                />
                <button className={`px-4 py-3 text-sm text-white font-semibold bg-[#629D23] hover:bg-[#2D3B29] transition-colors whitespace-nowrap flex-shrink-0`}>
                  Subscribe
                </button>
              </div>

              <label className="flex items-center mt-3 text-sm">
                <input type="checkbox" className="form-checkbox text-green-600 w-4 h-4 rounded" defaultChecked />
                <span className={`ml-2 ${TEXT_COLOR}`}>I would like to receive news and special offer</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="bg-white py-4 border-t border-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          
          {/* Left: Social Icons */}
          <div className="flex items-center space-x-6 order-2 md:order-1 mt-4 md:mt-0">
            <span className={`font-semibold ${TEXT_COLOR}`}>Follow Us:</span>
            <div className="flex space-x-3 text-gray-400">
              <Twitter size={20} className="hover:text-[#629D23] transition-colors cursor-pointer" />
              <Facebook size={20} className="hover:text-[#629D23] transition-colors cursor-pointer" />
              <Instagram size={20} className="hover:text-[#629D23] transition-colors cursor-pointer" />
              <Youtube size={20} className="hover:text-[#629D23] transition-colors cursor-pointer" />
            </div>
          </div>
          
          {/* Center: Copyright */}
          <p className={`order-3 md:order-2 mt-4 md:mt-0 ${TEXT_COLOR}`}>
            Copyright 2025 | SuppliMax. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}
