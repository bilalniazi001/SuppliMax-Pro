// src/lib/offersData.ts

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Bundle' | 'Package' | 'Flash Sale';
  badge: string;
  originalPrice: number;
  discountedPrice: number;
  image: string; // Main image for the bundle
  products: {
    name: string;
    image: string;
    id: string;
  }[];
  features: string[];
}

export const offers: Offer[] = [
  {
    id: 'bundle-1',
    title: 'Muscle Building Stack',
    subtitle: 'The Ultimate Trio for Growth',
    description: 'Combine the power of pure isolate protein, micronized creatine, and explosive pre-workout for maximum gains.',
    category: 'Bundle',
    badge: 'Best Value',
    originalPrice: 35000,
    discountedPrice: 28500,
    image: 'https://jackednutrition.pk/cdn/shop/files/1_9eb9b44a-6fab-4245-b2dc-e9803fa0749b.webp?v=1747299874', // Creatine as main
    products: [
      { 
        name: 'Rule 1 Isolate', 
        image: 'https://purenutrition.com.pk/cdn/shop/files/rule1-r1-isolate-5lb-pakistan_28a54fbc-0fe0-4a66-be96-be5ec3f3ad99.png?v=1767904964',
        id: 'dc8a'
      },
      { 
        name: 'The Curse Creatine', 
        image: 'https://jackednutrition.pk/cdn/shop/files/1_9eb9b44a-6fab-4245-b2dc-e9803fa0749b.webp?v=1747299874',
        id: 'a192'
      },
      { 
        name: 'C4 Original', 
        image: 'https://cellucor.com/cdn/shop/files/CELL_0224_P8_Digital_Ecomm_PDP_C4PWO_SoftLaunch_Feb2024-C4_Original_Hero-Rainbow-White_4fe126dd-9c89-42b4-baa1-bb5fb144175b.png?v=1776701176&width=1920',
        id: '11dc'
      }
    ],
    features: [
      '25g Pure Whey Isolate',
      '5g Micronized Creatine',
      'Explosive Pre-Workout Energy',
      'Free Shaker Bottle Included'
    ]
  },
  {
    id: 'package-1',
    title: 'Lean Transformation Kit',
    subtitle: 'Premium Fat Loss & Definition',
    description: 'Specially curated for those looking to shed fat while maintaining lean muscle mass. Includes premium ripped protein and advanced fat burner.',
    category: 'Package',
    badge: 'Premium',
    originalPrice: 42000,
    discountedPrice: 34999,
    image: 'https://theirongear.com/cdn/shop/products/Untitled-1_f468cbdd-b53a-4127-bf18-7c8fccdd1d04_grande.png?v=1667367332',
    products: [
      { 
        name: 'Muscle Tech Ripped', 
        image: 'https://theirongear.com/cdn/shop/products/Untitled-1_f468cbdd-b53a-4127-bf18-7c8fccdd1d04_grande.png?v=1667367332',
        id: 'cabf'
      },
      { 
        name: 'LIPO 6 Black', 
        image: 'https://vitaminshouse.com/cdn/shop/files/Nutrex_-_Lipo_6_Black_120caps_-_Vitamins_House-563448.png?v=1717491976',
        id: '126'
      },
      { 
        name: 'Amino Hardcore', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbPOGle6oNt7j1E9TaopqPIc6U9P_1NkTV_g&s',
        id: '56a7'
      }
    ],
    features: [
      'Weight Management Protein',
      'Thermogenic Fat Burner',
      'Essential Amino Support',
      'Personalized Diet Plan'
    ]
  },
  {
    id: 'bundle-2',
    title: 'Beginner Strength Pack',
    subtitle: 'Start Your Fitness Journey Right',
    description: 'Perfect for beginners. High-quality mass gainer and essential vitamins to help you kickstart your physical transformation.',
    category: 'Bundle',
    badge: 'New Arrival',
    originalPrice: 22000,
    discountedPrice: 18500,
    image: 'https://fitzone.pk/cdn/shop/files/kevin-levrone-anabolic-mass-gainer-3kg_785x.webp?v=1707151677',
    products: [
      { 
        name: 'Anabolic Mass Gainer', 
        image: 'https://fitzone.pk/cdn/shop/files/kevin-levrone-anabolic-mass-gainer-3kg_785x.webp?v=1707151677',
        id: '112'
      },
      { 
        name: 'Mens Multi+Test', 
        image: 'https://jackednutrition.pk/cdn/shop/files/GATMENMULTI_TESTVITAMIN.webp?v=1749011722',
        id: 'f085'
      },
      { 
        name: 'RC Creatine', 
        image: 'https://fitzone.pk/cdn/shop/files/ronnie-coleman-creatine-xs-120-servings.webp?v=1701041795',
        id: '8cef'
      }
    ],
    features: [
      'High Calorie Mass Gainer',
      'Complete Daily Vitamins',
      'Testosterone Support',
      'Easy to Digest Formula'
    ]
  }
];
