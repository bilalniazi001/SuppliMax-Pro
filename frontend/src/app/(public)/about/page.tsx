'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Mail,
  Phone,
  Clock,
  User,
  CheckCircle,
  Leaf,
  Percent
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Correct image paths (Ensure EXACT FILE NAME matches)
const aboutBannerImg = "/Images/prod-14.jpg";
const teamMember1 = "/Images/Persona.png";

const TEAM_DATA = [
  { name: 'Samuel Alexander', role: 'Founder & CEO', image: teamMember1, phone: '+258 3692 2569' },
];

const STATS_DATA = [
  { value: '60M+', label: 'Happy Customers' },
  { value: '105M+', label: 'Grocery Products' },
  { value: '80K+', label: 'Active Sellers' },
  { value: '60K+', label: 'Stores Worldwide' },
];

// FLASH SALE TIMER (unchanged)
const calculateTimeLeft = (targetDate: Date) => {
  let difference = +targetDate - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const FlashSaleTimer = () => {
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex items-center text-white text-sm bg-red-600 px-3 py-1 rounded-full shadow-lg">
      <Clock size={16} className="mr-2" />
      <span className="font-bold mr-2">Sale Ends In:</span>

      {Object.entries(timeLeft).map(([key, value]) => (
        <span
          key={key}
          className="text-sm font-semibold text-white bg-red-600/70 px-2 py-1 rounded mx-1"
        >
          {String(value).padStart(2, '0')} {key[0].toUpperCase()}
        </span>
      ))}
    </div>
  );
};

// ⭐ FIXED FeatureCard With Proper Types
interface FeatureCardProps {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  number,
  icon: Icon,
  title,
  description
}) => (
  <div className="p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white text-center">
    <div className="relative inline-block mb-6">
      <span className="absolute top-0 right-0 text-6xl font-extrabold text-gray-100 z-0">
        {number}
      </span>
      <div className="relative z-10 w-24 h-24 bg-green-50 flex items-center justify-center rounded-full mx-auto">
        <Icon size={40} className="text-[#629D23]" />
      </div>
    </div>

    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default function AboutPage() {
  return (
    <main>

      {/* HERO SECTION FIXED */}
      <section className="relative w-full h-[450px] bg-gray-800 flex items-center justify-center overflow-hidden">
        
        {/* Stable container for Image fill */}
        <div className="absolute inset-0">
          <Image
            src={aboutBannerImg}
            alt="About Banner"
            fill
            priority
            className="object-cover opacity-50"
          />
        </div>

        <div className="relative z-10 text-center text-white p-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Do You Want To Know Us?
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <button className="bg-[#629D23] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#2D3B29] transition">
            Contact Us
          </button>

          <div className="mt-8 flex justify-center items-center">
            <FlashSaleTimer />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="relative z-20 py-8 bg-white shadow-xl -mt-16 mx-auto max-w-6xl rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          {STATS_DATA.map((stat, index) => (
            <div key={index} className="text-center p-4">
              <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Why You Choose Us?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              number="01"
              icon={Leaf}
              title="Organic Food Services"
              description="Best organic food and services."
            />

            <FeatureCard
              number="02"
              icon={Percent}
              title="Best Prices & Discounts"
              description="We offer affordable pricing."
            />

            <FeatureCard
              number="03"
              icon={CheckCircle}
              title="Quality Assurance"
              description="We ensure premium quality products."
            />
          </div>
        </div>
      </section>

      {/* TEAM SECTION FIXED IMAGE */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
            Meet Our Expert Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center">
            {TEAM_DATA.map((member, index) => (
              <div key={index} className="text-center bg-white p-4 shadow-md rounded-lg max-w-[250px] w-full">

                {/* Stable container for fill */}
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="192px"
                    className="object-cover rounded-xl"
                  />
                </div>

                <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
                <p className="text-sm text-gray-500 mb-3">{member.role}</p>

                <div className="flex items-center justify-center text-[#629D23] text-sm">
                  <Phone size={14} className="mr-1" />
                  <span>{member.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
