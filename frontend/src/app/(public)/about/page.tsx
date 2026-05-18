'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Mail,
  Phone,
  Clock,
  User,
  CheckCircle,
  Leaf,
  Percent,
  ChevronRight,
  Target,
  Award,
  Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const aboutBannerImg = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop";
const storyImg = "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop";
const teamMember1 = "/Images/Persona.png";

const TEAM_DATA = [
  { name: 'Samuel Alexander', role: 'Founder & CEO', image: teamMember1, phone: '+92 321 5464 895' },
  { name: 'Bilal Khan', role: 'Lead Developer', image: teamMember1, phone: '+92 321 5464 895' },
  { name: 'Sarah Jenkins', role: 'Operations Manager', image: teamMember1, phone: '+92 321 5464 895' },
  { name: 'David Smith', role: 'Customer Relations', image: teamMember1, phone: '+92 321 5464 895' },
];

const STATS_DATA = [
  { value: 60, suffix: 'M+', label: 'Happy Customers' },
  { value: 105, suffix: 'M+', label: 'Products Sold' },
  { value: 80, suffix: 'K+', label: 'Active Sellers' },
  { value: 60, suffix: 'K+', label: 'Stores Worldwide' },
];

const Counter = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center p-6">
      <h3 className="text-5xl font-extrabold text-gray-900 mb-2">
        {count}{suffix}
      </h3>
      <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">{label}</p>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, index }: { icon: LucideIcon, title: string, description: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group"
  >
    <div className="w-16 h-16 bg-[#629D23]/10 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#629D23] transition-colors duration-300">
      <Icon size={32} className="text-[#629D23] group-hover:text-white transition-colors duration-300" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <main className="bg-[#FDFDFD] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutBannerImg}
            alt="About Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-sm mb-6 border border-white/30">
              ESTABLISHED 2024
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter leading-none">
              Defining the Future of <span className="text-[#89C343]">Supply</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              SuppliMax is more than just a marketplace. We are a bridge between quality producers and conscious consumers, committed to excellence and sustainability.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-[#629D23] text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-[#629D23]/30 hover:scale-105 transition-transform">
                Our Journey
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                Contact Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-[40px] shadow-2xl p-12 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {STATS_DATA.map((stat, index) => (
                <Counter key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-square lg:aspect-auto lg:h-[600px]">
                <img
                  src={storyImg}
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-[#629D23] p-12 rounded-[40px] text-white hidden md:block shadow-2xl">
                <h4 className="text-4xl font-bold mb-2">10+</h4>
                <p className="font-medium opacity-80 uppercase tracking-widest text-sm">Years of Experience</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="text-[#629D23] font-bold tracking-widest uppercase text-sm">Our Legacy</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Crafting Excellence in Every Shipment
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Starting from a small warehouse in Faisalabad, SuppliMax has grown into a global powerhouse. We believe that everyone deserves access to premium quality products without compromise.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Target, title: 'Our Mission', text: 'To revolutionize the supply chain with transparency.' },
                  { icon: Award, title: 'Quality First', text: 'Rigorous testing for every product we list.' },
                  { icon: Users, title: 'Community Driven', text: 'Supporting local sellers and global buyers.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <item.icon size={24} className="text-[#629D23]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-500">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Why You Choose Us?</h2>
            <p className="text-xl text-gray-500">We don&apos;t just deliver products; we deliver trust and value at every step of the way.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              index={0}
              icon={Leaf}
              title="Organic & Sustainable"
              description="We prioritize products that are kind to you and the planet, ensuring a sustainable future."
            />
            <FeatureCard
              index={1}
              icon={Percent}
              title="Unbeatable Value"
              description="Our direct-to-consumer model allows us to offer premium products at wholesale prices."
            />
            <FeatureCard
              index={2}
              icon={CheckCircle}
              title="Verified Sellers"
              description="Every seller on our platform goes through a rigorous 10-step verification process."
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Meet Our Visionaries</h2>
              <p className="text-xl text-gray-500">The brilliant minds behind SuppliMax working tirelessly to serve you better.</p>
            </div>
            <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-[#629D23] transition-colors flex items-center gap-2">
              View All Team <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_DATA.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden mb-6 shadow-xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <p className="text-white font-bold flex items-center gap-2 mb-2">
                      <Phone size={16} /> {member.phone}
                    </p>
                    <div className="flex gap-4">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-[#629D23] cursor-pointer transition-colors">
                        <Mail size={16} />
                      </div>
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-[#629D23] cursor-pointer transition-colors">
                        <Users size={16} />
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-[#629D23] font-bold text-sm tracking-widest uppercase">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-[#629D23] rounded-[40px] p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 relative z-10">Ready to transform your business?</h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto relative z-10">
              Join thousands of satisfied partners who trust SuppliMax for their supply needs.
            </p>
            <button className="bg-white text-[#629D23] px-12 py-5 rounded-full font-extrabold text-lg hover:scale-105 transition-transform relative z-10 shadow-2xl">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
