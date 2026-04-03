import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook, Youtube, ArrowRight } from 'lucide-react';

const Footer = () => {
    const links = {
        'Shop': [{label: 'Eyeglasses', to: '/products?category=eyeglasses'}, {label: 'Sunglasses', to: '/products?category=sunglasses'}, {label: 'Contact Lenses', to: '/products?category=contact-lenses'}, {label: 'Reading Glasses', to: '/products?category=reading-glasses'}, {label: 'Computer Glasses', to: '/products?category=computer-glasses'}, {label: 'Kids Eyewear', to: '/products?category=kids'}],
        'Services': [{label: 'Store Locator', to: '/'}, {label: 'Home Eye Checkup', to: '/'}, {label: 'Frame Size Guide', to: '/'}, {label: '3D Try-On', to: '/products'}, {label: 'SpectsMart Gold', to: '/'}, {label: 'Buying Guide', to: '/'}],
        'Support': [{label: 'Customer Support', to: '/about'}, {label: 'Order Tracking', to: '/'}, {label: 'Returns & Refunds', to: '/'}, {label: 'FAQ', to: '/'}, {label: 'Warranty', to: '/'}, {label: 'Contact Us', to: '/about'}],
        'Company': [{label: 'About Us', to: '/about'}, {label: 'Careers', to: '/'}, {label: 'Press', to: '/'}, {label: 'Investors', to: '/'}, {label: 'SpectsMart Blog', to: '/'}, {label: 'Privacy Policy', to: '/'}],
    };

    return (
        <footer className="bg-[#000042] text-white">
            {/* Newsletter */}
            <div className="border-b border-white/10">
                <div className="lk-container py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black">Stay in the Loop</h3>
                            <p className="text-blue-200 text-sm mt-1">Get exclusive deals, new arrivals & eye care tips.</p>
                        </div>
                        <form className="flex w-full max-w-md gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-xl text-sm outline-none focus:border-teal transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-teal hover:bg-teal-700 text-white font-bold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                Subscribe <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="lk-container py-14">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="https://res.cloudinary.com/dhpfphivh/image/upload/v1775127135/ChatGPT_Image_Apr_2__2026__04_18_20_PM-removebg-preview_jrgzgo.png" alt="SpectsMart Logo" className="h-16 object-contain" />
                            <div>
                                <div className="font-black text-2xl tracking-tight">SPECTSMART</div>
                            </div>
                        </div>

                        <p className="text-white/50 text-sm leading-relaxed mb-6">
                            SpectsMart. Providing premium eyeglasses, sunglasses & contact lenses with the promise of quality and style.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2.5 mb-6">
                            <div className="flex items-center gap-2.5 text-sm text-white/60">
                                <Phone size={14} className="text-teal shrink-0" />
                                <span>9493862095</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-white/60">
                                <Mail size={14} className="text-teal shrink-0" />
                                <span>support@spectsmart.com</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-white/60">
                                <MapPin size={14} className="text-teal shrink-0" />
                                <span>Shop No 1, Near Maheboob Tent House, Swaraj Nagar, Near New Rose Bakery, Borabanda, Hyderabad-500018, Telangana</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {[
                                { Icon: Instagram, color: 'hover:bg-pink-600' },
                                { Icon: Facebook, color: 'hover:bg-blue-600' },
                                { Icon: Twitter, color: 'hover:bg-sky-500' },
                                { Icon: Youtube, color: 'hover:bg-red-600' },
                            ].map(({ Icon, color }, i) => (
                                <button
                                    key={i}
                                    className={`w-9 h-9 bg-white/10 ${color} rounded-xl flex items-center justify-center transition-colors duration-200`}
                                >
                                    <Icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(links).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-white">{title}</h4>
                            <ul className="space-y-2.5">
                                {items.map(item => (
                                    <li key={item.label}>
                                        <Link
                                            to={item.to}
                                            className="text-white/50 text-sm hover:text-teal transition-colors duration-200"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="lk-container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-white/40 text-xs">
                    <span>© 2025 SpectsMart. All rights reserved.</span>
                    <div className="flex items-center gap-4">
                        <span>Made with ❤️ in India</span>
                        <span>·</span>
                        <Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
                        <span>·</span>
                        <span>Privacy Policy</span>
                        <span>·</span>
                        <span>Terms of Use</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
