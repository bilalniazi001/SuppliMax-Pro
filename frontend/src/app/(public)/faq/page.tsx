'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDown,
  Search,
  ShieldCheck,
  Truck,
  CreditCard,
  RotateCcw,
  HeadphonesIcon,
  PackageCheck,
  FileText,
  Lock,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: LucideIcon;
  faqs: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: 'Orders & Shipping',
    icon: Truck,
    faqs: [
      {
        question: 'How can I place an order on SuppliMax?',
        answer: 'Simply browse our store, add your desired products to the cart, and proceed to checkout. You can pay via bank transfer, JazzCash, Easypaisa, or Cash on Delivery (COD).'
      },
      {
        question: 'How long does delivery take?',
        answer: 'Delivery within Faisalabad takes 1-2 business days. For other cities in Pakistan, it typically takes 3-5 business days depending on your location.'
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Yes! We offer free shipping on all orders above Rs. 5,000. For orders below this amount, a flat shipping fee of Rs. 200 is applied.'
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes, once your order is shipped, you will receive a tracking number via SMS and email. You can also track your order from the "My Orders" section in your account.'
      },
      {
        question: 'Do you deliver outside Pakistan?',
        answer: 'Currently, we only deliver within Pakistan. We are working on expanding our delivery network internationally. Stay tuned for updates!'
      },
    ]
  },
  {
    title: 'Payments',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Cash on Delivery (COD), Bank Transfer (HBL, Meezan Bank), JazzCash, Easypaisa, and Debit/Credit Cards (Visa, MasterCard).'
      },
      {
        question: 'Is online payment safe on SuppliMax?',
        answer: 'Absolutely. All online transactions are encrypted with SSL security, and we never store your card details on our servers.'
      },
      {
        question: 'Can I pay in installments?',
        answer: 'Currently, installment plans are not available. However, we frequently run special offers and discounts to make our products more affordable.'
      },
    ]
  },
  {
    title: 'Returns & Refunds',
    icon: RotateCcw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 7-day return policy. If you receive a damaged, expired, or wrong product, you can request a return within 7 days of delivery. The product must be unused and in its original packaging.'
      },
      {
        question: 'How do I request a refund?',
        answer: 'Contact our support team at bilalkhanniazi765@gmail.com or call +92 321 5464 895. Provide your order number and reason for the return. Refunds are processed within 5-7 business days after the returned product is received.'
      },
      {
        question: 'Who pays for return shipping?',
        answer: 'If the return is due to our error (damaged, wrong, or expired product), we cover the return shipping cost. For change-of-mind returns, the customer bears the shipping cost.'
      },
    ]
  },
  {
    title: 'Products & Quality',
    icon: PackageCheck,
    faqs: [
      {
        question: 'Are your supplements original and authentic?',
        answer: 'Yes, 100%. We source all our products directly from authorized distributors and verified international brands. Every product comes with batch numbers and expiry dates clearly printed.'
      },
      {
        question: 'Do you sell expired products?',
        answer: 'Never. We have a strict quality control policy. All products in our inventory are checked regularly, and any product close to its expiry date is removed from sale.'
      },
      {
        question: 'Can I get advice on which supplement is right for me?',
        answer: 'Of course! Our team is available 24/7 to guide you. You can call us at +92 321 5464 895 or send an email to bilalkhanniazi765@gmail.com with your fitness goals, and we will recommend the best products for you.'
      },
    ]
  },
  {
    title: 'Account & Privacy',
    icon: Lock,
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Login" button in the top navigation bar and select "Sign Up". You can register using your email address or sign in with Google for a faster experience.'
      },
      {
        question: 'How can I reset my password?',
        answer: 'Go to your Account settings and click "Reset Password". You will need to verify your identity using your CNIC number or registered phone number before setting a new password.'
      },
      {
        question: 'Is my personal data safe with SuppliMax?',
        answer: 'Yes. We follow strict data privacy practices. Your personal information is encrypted and never shared with third parties without your consent. Read our full Privacy Policy for more details.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes. Go to your Account settings and click "Delete Account". Please note that this action is permanent and cannot be undone. All your order history and data will be removed.'
      },
    ]
  },
  {
    title: 'Customer Support',
    icon: HeadphonesIcon,
    faqs: [
      {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via:\n• Phone: +92 321 5464 895 (24/7)\n• Email: bilalkhanniazi765@gmail.com\n• Visit us: 95 street Faisal Town, West Canal Road, Faisalabad, Punjab, Pakistan'
      },
      {
        question: 'What are your support hours?',
        answer: 'We are available 24/7, 365 days a year. Whether it\'s a product question, order issue, or general inquiry — we are always here to help.'
      },
      {
        question: 'Can I visit your physical store?',
        answer: 'Yes! Our office is located at 95 street Faisal Town, West Canal Road, Faisalabad, Punjab, Pakistan. You are welcome to visit during business hours (9 AM - 9 PM).'
      },
    ]
  },
];

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({ item, isOpen, onToggle }) => (
  <div className="border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50/50 transition-colors"
    >
      <span className="text-lg font-semibold text-gray-900 pr-4">{item.question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ChevronDown size={22} className={`${isOpen ? 'text-[#629D23]' : 'text-gray-400'} transition-colors`} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="px-6 pb-6 text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-50 pt-4">
            {item.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  // Filter FAQs based on search
  const filteredCategories = searchQuery.trim()
    ? FAQ_CATEGORIES.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.faqs.length > 0)
    : FAQ_CATEGORIES;

  return (
    <main className="min-h-screen bg-[#FDFDFD] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#2D3B29] py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#629D23] rounded-full"
              style={{
                width: `${60 + i * 30}px`,
                height: `${60 + i * 30}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(40px)',
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-sm mb-8 border border-white/20">
              <HelpCircle size={18} />
              HELP CENTER
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
              How Can We <span className="text-[#89C343]">Help You?</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Find instant answers to the most commonly asked questions about orders, payments, returns, and more.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory(0);
                }}
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-400 text-lg outline-none border border-white/30 shadow-2xl focus:ring-4 focus:ring-[#629D23]/20 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {searchQuery.trim() ? (
            /* Search Results View */
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Search Results for &ldquo;{searchQuery}&rdquo;
                <span className="text-gray-400 text-lg ml-3">
                  ({filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)} found)
                </span>
              </h2>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, catIdx) => (
                  <div key={catIdx} className="mb-10">
                    <h3 className="text-xl font-bold text-[#629D23] mb-4 flex items-center gap-2">
                      <category.icon size={22} />
                      {category.title}
                    </h3>
                    {category.faqs.map((faq, faqIdx) => {
                      const key = `search-${catIdx}-${faqIdx}`;
                      return (
                        <AccordionItem
                          key={key}
                          item={faq}
                          isOpen={openIndex === key}
                          onToggle={() => toggleFAQ(key)}
                        />
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <HelpCircle size={64} className="text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-400 mb-3">No results found</h3>
                  <p className="text-gray-400">Try a different search term or browse our categories below.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-6 px-8 py-3 bg-[#629D23] text-white rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Browse All FAQs
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Category View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Category Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Categories</h3>
                  {FAQ_CATEGORIES.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setActiveCategory(index);
                          setOpenIndex(null);
                        }}
                        whileHover={{ x: 5 }}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 ${
                          activeCategory === index
                            ? 'bg-[#629D23] text-white shadow-xl shadow-[#629D23]/20'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <Icon size={22} />
                        <div>
                          <span className="font-bold block">{category.title}</span>
                          <span className={`text-sm ${activeCategory === index ? 'text-white/70' : 'text-gray-400'}`}>
                            {category.faqs.length} questions
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="lg:col-span-8">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    {React.createElement(FAQ_CATEGORIES[activeCategory].icon, { size: 28, className: 'text-[#629D23]' })}
                    {FAQ_CATEGORIES[activeCategory].title}
                  </h2>
                  {FAQ_CATEGORIES[activeCategory].faqs.map((faq, faqIdx) => {
                    const key = `${activeCategory}-${faqIdx}`;
                    return (
                      <AccordionItem
                        key={key}
                        item={faq}
                        isOpen={openIndex === key}
                        onToggle={() => toggleFAQ(key)}
                      />
                    );
                  })}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-gray-900 to-[#2D3B29] rounded-[40px] p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#629D23]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#629D23]/10 rounded-full blur-[80px]" />

            <HelpCircle size={48} className="text-[#89C343] mx-auto mb-6 relative z-10" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 relative z-10">
              Still have questions?
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto relative z-10">
              Our support team is available 24/7 to assist you. Don&apos;t hesitate to reach out!
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link
                href="/contacts"
                className="bg-[#629D23] text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-[#629D23]/30 hover:scale-105 transition-transform"
              >
                Contact Us
              </Link>
              <a
                href="tel:+923215464895"
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Call +92 321 5464 895
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
