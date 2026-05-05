'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion'; 
import { Star } from 'lucide-react'; 
import background from '../../../../public/Images/prod-14.jpg'

interface Review {
  id: number;
  text: string;
  author: string;
  source: string;
  rating: number; 
}

const TESTIMONIALS_DATA: Review[] = [
  {
    id: 1,
    text: "Discount Supplements is probably the best protein supplement company in the UK in every respect. Thoroughly recommended.",
    author: "Ken Haywood",
    source: "Cunningham Store",
    rating: 5,
  },
  {
    id: 2,
    text: "Good product good price prompt efficient service. Gives you energy to workout harder and longer. Many thanks for your help.",
    author: "Brian G. Moore",
    source: "Gym Mod",
    rating: 5,
  },
  {
    id: 3,
    text: "Great products. Bought from this site a few times now. Delivery service is decent too considering everything that's been going on.",
    author: "John Stone",
    source: "Fitness Club",
    rating: 5,
  },
];

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 5 }) => {
  return (
    <div className="flex items-center text-green-500">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${i < rating ? 'fill-green-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};


const TestimonialCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <motion.div
      className="testimonial-clip relative p-8 bg-white text-gray-800 shadow-xl transition-all duration-300 h-full
                 transform hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="mb-4">
        <StarRating rating={review.rating} size={4} />
      </div>

      <blockquote className="text-lg italic leading-relaxed mb-6">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-base font-bold">{review.author}</p>
        <p className="text-sm text-gray-500">{review.source}</p>
      </div>

      <style jsx global>{`
        .testimonial-clip {
          clip-path: polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0% 100%);
          border-radius: 0.5rem;
        }
      `}</style>
    </motion.div>
  );
};


export default function TestimonialSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { 
            type: "spring", 
            stiffness: 100,
            damping: 10
        }
    },
  };
  
  return (
    <section className="bg-white relative overflow-hidden py-16 md:py-24 border-t border-gray-100">
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center mb-16">
          <p className="text-[#629D23] font-bold uppercase tracking-widest mb-2 text-sm">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase">
            What Our Customers Say
          </h2>
          <div className="w-16 h-1 bg-[#629D23] mx-auto mt-4"></div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
        >
          {TESTIMONIALS_DATA.map((review) => (
            <motion.div key={review.id} variants={itemVariants} className="flex flex-col items-center text-center">
              <div className="mb-4">
                <StarRating rating={review.rating} size={5} />
              </div>
              <blockquote className="text-lg text-gray-600 italic leading-relaxed mb-6">
                "{review.text}"
              </blockquote>
              <div className="mt-auto">
                <p className="text-base font-extrabold text-gray-900 uppercase">{review.author}</p>
                <p className="text-xs font-bold text-[#629D23] uppercase tracking-widest mt-1">{review.source}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}