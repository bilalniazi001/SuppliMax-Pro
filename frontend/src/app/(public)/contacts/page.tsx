'use client';

import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    CheckCircle,
    RotateCcw,
    Headset,
    Gift,
    ChevronDown,
    Send,
    ExternalLink,
    LucideIcon
} from 'lucide-react';

interface StoreInfo {
    city: string;
    address: string;
    phone: string;
    email: string;
    country: string;
    province: string;
}

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const contactBannerImgUrl = 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop';

const STORE_DATA: StoreInfo[] = [
    {
        city: 'Faisalabad',
        address: '95 street Faisal Town, West Canal Road',
        phone: '+92 321 5464 895',
        email: 'bilalkhanniazi765@gmail.com',
        province: 'Punjab',
        country: 'Pakistan'
    }
];

const CONTACT_FEATURES: Feature[] = [
    { icon: Headset, title: '24/7 Support', description: 'Always here to help you with your queries.' },
    { icon: CheckCircle, title: 'Quality Assurance', description: 'Premium quality products guaranteed.' },
    { icon: RotateCcw, title: 'Easy Returns', description: 'Hassle-free return policy for our customers.' },
    { icon: Gift, title: 'Daily Deals', description: 'Special discounts on your everyday purchases.' },
];

const staggerTransition: Transition = {
    staggerChildren: 0.1,
};

const springTransition: Transition = {
    type: "spring",
    stiffness: 100,
    damping: 15
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: staggerTransition,
    },
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: springTransition,
    },
};

const glassmorphismStyle = "backdrop-blur-xl bg-white/70 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]";

const ContactInfoCard: React.FC<StoreInfo> = ({ city, address, phone, email, province, country }) => (
    <motion.div
        variants={itemVariants}
        className={`${glassmorphismStyle} p-8 rounded-2xl mb-6 hover:translate-y-[-5px] transition-all duration-300`}
    >
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#629D23]/10 rounded-xl">
                <MapPin className="text-[#629D23]" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{city} Office</h3>
        </div>

        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                    <MapPin size={18} className="text-gray-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-800 font-semibold">{address}</p>
                    <p className="text-gray-600 text-sm">{province}, {country}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                    <Phone size={18} className="text-gray-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-[#629D23] font-bold text-lg">{phone}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                    <Mail size={18} className="text-gray-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800 font-semibold">{email}</p>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function ContactPage() {
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        console.log('Form Submitted:', formData);
    };

    const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.8105342721013!2d73.15805497534433!3d31.458059748232924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922684814986161%3A0x6d36e26b155d9d40!2sFaisal%20Town%2C%20Faisalabad%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1714810500000!5m2!1sen!2s";
    const googleMapsExternalLink = "https://www.google.com/maps/search/Faisal+Town+Canal+Road+Faisalabad";

    return (
        <main className="min-h-screen bg-[#FDFDFD] overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={contactBannerImgUrl}
                        alt="Contact Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-[2px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                            Let&apos;s Start a <span className="text-[#89C343]">Conversation</span>
                        </h1>
                        <p className="text-xl text-gray-200 leading-relaxed mb-8">
                            Have questions or just want to say hello? Our team in Faisalabad is here to assist you with anything you need.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-[#629D23] hover:bg-[#4d7d1b] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-[#629D23]/30 flex items-center gap-2">
                                <Send size={20} />
                                Get in Touch
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2">
                                <Phone size={20} />
                                Call Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 relative">
                <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#629D23]/5 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-[#629D23]/5 blur-[100px] rounded-full -z-10" />

                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left: Contact Info & Features */}
                        <div className="lg:col-span-5 space-y-12">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-block px-4 py-1 rounded-full bg-[#629D23]/10 text-[#629D23] font-bold text-sm mb-4"
                                >
                                    CONTACT US
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl font-bold text-gray-900 mb-6"
                                >
                                    Where to Find Us?
                                </motion.h2>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    We are located in the heart of Faisalabad. Drop by for a cup of tea or reach out to us via any of the channels below.
                                </p>
                            </div>

                            {STORE_DATA.map((store, index) => (
                                <ContactInfoCard key={index} {...store} />
                            ))}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {CONTACT_FEATURES.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
                                    >
                                        <feature.icon className="text-[#629D23] mb-4" size={28} />
                                        <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                                        <p className="text-sm text-gray-500 leading-tight">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Map & Form */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Map Container */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative group rounded-3xl overflow-hidden shadow-2xl h-[400px]"
                            >
                                <iframe
                                    title="Faisalabad Office Location"
                                    src={mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    className="grayscale hover:grayscale-0 transition-all duration-700"
                                ></iframe>
                                
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all pointer-events-none" />
                                
                                <a 
                                    href={googleMapsExternalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-6 left-6 bg-white text-gray-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:bg-[#629D23] hover:text-white transition-all transform group-hover:scale-105 active:scale-95 pointer-events-auto"
                                >
                                    <ExternalLink size={18} />
                                    Open in Google Maps
                                </a>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`${glassmorphismStyle} p-10 rounded-3xl`}
                            >
                                <h3 className="text-3xl font-bold text-gray-900 mb-8">Send a Message</h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#629D23] focus:ring-4 focus:ring-[#629D23]/10 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#629D23] focus:ring-4 focus:ring-[#629D23]/10 transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                                        <div className="relative">
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#629D23] focus:ring-4 focus:ring-[#629D23]/10 transition-all outline-none appearance-none"
                                            >
                                                <option value="" disabled>Select a topic</option>
                                                <option value="Inquiry">General Inquiry</option>
                                                <option value="Support">Order Support</option>
                                                <option value="Partnership">Business Partnership</option>
                                            </select>
                                            <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="How can we help you today?"
                                            required
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#629D23] focus:ring-4 focus:ring-[#629D23]/10 transition-all outline-none resize-none"
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-[#629D23] text-white font-bold py-5 rounded-xl shadow-xl shadow-[#629D23]/20 flex items-center justify-center gap-3 transition-all"
                                    >
                                        <Send size={20} />
                                        Send Message
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}