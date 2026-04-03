import React from 'react';
import { User, MapPin, Award, Heart, Phone, Mail } from 'lucide-react';

const About = () => {
    return (
        <main className="animate-fade-in bg-gray-50 min-h-screen pb-16">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#000042] via-[#000066] to-[#000042] text-white py-16 md:py-24">
                <div className="lk-container text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">About SpectsMart</h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        Your trusted destination for premium eyewear, combining style, clarity, and exceptional service.
                    </p>
                </div>
            </div>

            <div className="lk-container mt-12 md:mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Owner Info & Details */}
                    <div className="space-y-8 order-2 md:order-1">
                        <div>
                            <p className="text-teal text-sm font-bold uppercase tracking-widest mb-2">Meet The Owner</p>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-primary-900 mb-4">
                                Mustafa Mohd
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                With a passion for vision care and a keen eye for premium aesthetics, Mustafa started SpectsMart with a simple mission: to provide high-quality, stylish eyewear that doesn't compromise on comfort or durability.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg mt-4">
                                We believe that glasses are more than just a tool for seeing better—they are a reflection of your personality. That's why we curate only the best frames and use state-of-the-art tech like our 3D Virtual Try-On to help you find your perfect match.
                            </p>
                        </div>

                        {/* Core Values */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-teal/10 rounded-2xl flex items-center justify-center text-teal shrink-0">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary-900 mb-1">Premium Quality</h4>
                                    <p className="text-xs text-gray-500">Only the finest materials for our frames and lenses.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shrink-0">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary-900 mb-1">Customer First</h4>
                                    <p className="text-xs text-gray-500">Dedicated support and a seamless shopping experience.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 mt-8">
                            <h3 className="font-black text-xl text-primary-900 mb-4">Get in Touch</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin size={20} className="text-teal shrink-0 mt-0.5" />
                                    <span className="text-gray-600 text-sm">Shop No 1, Near Maheboob Tent House, Swaraj Nagar, Near New Rose Bakery, Borabanda, Hyderabad-500018, Telangana</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-teal shrink-0" />
                                    <span className="text-gray-600 font-semibold">9493862095</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-teal shrink-0" />
                                    <span className="text-gray-600 font-semibold">support@spectsmart.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image/Visual Area */}
                    <div className="order-1 md:order-2 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-teal rounded-[3rem] rotate-6 opacity-20 transform transition-transform group-hover:rotate-12"></div>
                            <div className="absolute inset-0 bg-primary-900 rounded-[3rem] -rotate-3 opacity-10"></div>
                            <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop"
                                    alt="Optician store"
                                    className="w-full max-w-md h-[500px] object-cover rounded-[2.5rem]"
                                />
                            </div>
                            
                            {/* Floating Stats */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-soft">
                                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-black text-xl text-primary-900">
                                    5+
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-primary-900">Years of</div>
                                    <div className="text-xs text-gray-500">Excellence</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default About;
