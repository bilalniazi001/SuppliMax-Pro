'use client'; 

import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react'; 
import { motion, Variants, Transition } from 'framer-motion'; 
import { 
    Mail, 
    Phone, 
    MapPin, 
    CheckCircle, 
    RotateCcw, 
    Headset, 
    Gift,
    ChevronDown,
    Send,
    LucideIcon 
} from 'lucide-react'; 

interface StoreInfo {
    city: string;
    address: string;
    phone: string;
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

const contactBannerImgUrl: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbICWZ272khb3LxwcR5J2MzfaU1jgcSmxAJA&s'; 
const storeImageUrl: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxmuy1nRIzH0aST7wPvauJ82LGgLLeaVgSLgv3qGfs1xYbbYsaNshXqhrfjVNdmLCrQY&usqp=CAU'; 


const STORE_DATA: StoreInfo[] = [ 
    { 
        city: 'Berlin Germany Store', 
        address: '88 New Road, Hamburg, Berlin, Germany', 
        phone: '+258 7931 9268' 
    },
    { 
        city: 'Frankfurt Germany Store', 
        address: '500 Main Street, Frankfurt, Germany', 
        phone: '+258 7931 9268' 
    },
];

const GREEN_BAR_FEATURES: Feature[] = [ 
    { icon: CheckCircle, title: 'Best Prices & Offers', description: 'We provided special discounts on your every purchase.' },
    { icon: RotateCcw, title: '100% Return Policy', description: 'We provided special discounts on your every purchase.' },
    { icon: Headset, title: 'Support 24/7', description: 'We provided special discounts on your every purchase.' },
    { icon: Gift, title: 'Great Offer Daily Deal', description: 'We provided special discounts on your every purchase.' },
];

const FOOTER_LINKS = {
    company: [
        'About Us', 'Delivery Information', 'Privacy Policy', 
        'Terms & Conditions', 'Support Center', 'Payment Options'
    ],
    shop: [
        'Contact Us', 'Returns & Refunds', 'Wishlist', 
        'My Account', 'FAQs', 'Shopping'
    ],
};


const staggerTransition: Transition = {
    staggerChildren: 0.1,
};

const springTransition: Transition = {
    type: "spring",
    stiffness: 100,
    damping: 12
};

const containerVariants: Variants = { 
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: staggerTransition,
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: springTransition, 
    },
};

const ContactCard: React.FC<StoreInfo> = ({ city, address, phone }) => (
    <motion.div 
        variants={itemVariants}
        className="border-l-4 border-[#629D23] p-6 shadow-md transition-shadow hover:shadow-xl bg-white rounded-r-lg mb-6"
    >
        <h3 className="text-xl font-bold text-gray-800 mb-2">{city}</h3>
        
        <div className="flex items-start text-gray-600 mb-2">
            <MapPin size={20} className="text-[#629D23] flex-shrink-0 mt-1 mr-2" />
            <span className='text-sm'>{address}</span>
        </div>
        
        <div className="flex items-start text-gray-600">
            <Phone size={20} className="text-[#629D23] flex-shrink-0 mt-1 mr-2" />
            <span className='text-sm font-semibold'>{phone}</span>
        </div>
    </motion.div>
);

const FeatureItem: React.FC<Feature> = ({ icon: Icon, title, description }) => (
    <div className="flex items-start space-x-3 p-4">
        <Icon size={24} className="text-white flex-shrink-0 mt-1" />
        <div>
            <h4 className="text-lg font-bold text-white">{title}</h4>
            <p className="text-sm text-gray-200">{description}</p>
        </div>
    </div>
);

export default function ContactPage() {
    
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
    };
    
    const animatedCircles = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            duration: 20 + Math.random() * 10,
            delay: Math.random() * 5,
            width: 40 + i * 5,
            height: 40 + i * 5
        }));
    }, []);


    return (
        <main className="min-h-screen bg-gray-50 font-sans">
            
            <section className="relative h-[300px] bg-gray-800 flex items-center justify-center overflow-hidden">
                <img
                    src={contactBannerImgUrl} 
                    alt="Contact background image"
                    className="absolute inset-0 w-full h-full object-cover opacity-40" 
                    style={{ objectFit: 'cover' }}
                />
                
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center text-white p-6 backdrop-blur-sm bg-black/10 rounded-xl"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wider">
                        Ask Us Question
                    </h1>
                    <p className="text-md text-gray-300 max-w-2xl mx-auto">
                        Hamari team se rabta karen. Hum aapke har sawal ka jawab dene ke liye hazir hain.
                    </p>
                </motion.div>
                
                <div className="absolute inset-0 z-0 opacity-10">
                    {animatedCircles.map((circle, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-[#629D23] rounded-full"
                            initial={{ 
                                scale: 0, 
                                x: circle.x, 
                                y: circle.y  
                            }}
                            animate={{ 
                                scale: [1, 1.5, 1], 
                                rotate: 360,
                                opacity: [0.1, 0.3, 0.1],
                                transition: { 
                                    duration: circle.duration, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    delay: circle.delay
                                } 
                            }}
                            style={{ width: circle.width, height: circle.height }}
                        />
                    ))}
                </div>
            </section>
            
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                    >
                        <div className="lg:col-span-1">
                            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#629D23] pb-2 inline-block">
                                You can ask us questions!
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-gray-500 mb-10">
                                Hum aapki service ke liye din raat mojood hain. Aap in locations par bhi hum se mil sakte hain.
                            </motion.p>
                            
                            {STORE_DATA.map((store, index) => (
                                <ContactCard key={index} {...store} />
                            ))}
                        </div>
                        
                        <motion.div 
                            variants={itemVariants} 
                            className="lg:col-span-2 shadow-2xl rounded-lg overflow-hidden"
                        >
                            <div className="w-full h-[450px] bg-gray-200 flex items-center justify-center text-gray-600 font-semibold border border-gray-300">
                                <iframe
                                    title="Google Map Location"
                                    src="https://maps.google.com/maps?q=Berlin%20Germany%20Store&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-white border-t border-b border-gray-200">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-3xl font-extrabold text-gray-900 mb-10 text-center"
                    >
                        Fill Up The Form If You Have Any Question
                    </motion.h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        
                        <motion.form 
                            onSubmit={handleSubmit}
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-6 p-8 bg-gray-50 rounded-lg shadow-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="sr-only">Your Name</label>
                                    <motion.input
                                        whileHover={{ scale: 1.01 }}
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Your Name *"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:border-[#629D23] focus:ring-[#629D23]/50 transition duration-200"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="sr-only">Your Email</label>
                                    <motion.input
                                        whileHover={{ scale: 1.01 }}
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Your Email *"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:border-[#629D23] focus:ring-[#629D23]/50 transition duration-200"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="subject" className="sr-only">Subject/Select Option</label>
                                <div className="relative">
                                    <motion.select
                                        whileHover={{ scale: 1.01 }}
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 appearance-none border border-gray-300 rounded-md bg-white focus:border-[#629D23] focus:ring-[#629D23]/50 transition duration-200"
                                    >
                                        <option value="" disabled>Select Subject/Option *</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Product Support">Product Support</option>
                                        <option value="Order Tracking">Order Tracking</option>
                                        <option value="Partnership">Partnership</option>
                                    </motion.select>
                                    <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="sr-only">Your Message</label>
                                <motion.textarea
                                    whileHover={{ scale: 1.01 }}
                                    id="message"
                                    name="message"
                                    rows={5}
                                    placeholder="Write Message Here *"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-[#629D23] focus:ring-[#629D23]/50 transition duration-200"
                                ></motion.textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(98, 157, 35, 0.5)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full md:w-auto bg-[#629D23] text-white font-semibold px-8 py-3 rounded-md transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <Send size={20} />
                                <span>Send Message</span>
                            </motion.button>
                        </motion.form>
                        
                        <motion.div 
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="hidden lg:block shadow-2xl rounded-xl overflow-hidden"
                        >
                            <img
                                src={storeImageUrl}
                                alt="Woman shopping groceries"
                                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.05]"
                                style={{ objectFit: 'cover' }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
            
        </main>
    );
}