import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Eye, Sun, Monitor, BookOpen,
    Star, ArrowRight, Shield, Truck, RefreshCw, Award,
    Glasses, Phone, Play, TrendingUp
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

// Hardcoded hero slides for a rich Lenskart-style experience
const HERO_SLIDES = [
    {
        id: 1,
        tag: '🔥 MEGA SALE',
        title: 'Premium Eyeglasses',
        subtitle: 'Starting at ₹1000',
        description: 'Explore 5000+ styles from top brands. Free home try-on available.',
        cta: 'Shop Eyeglasses',
        bg: 'from-[#000042] via-[#000066] to-[#0a0a80]',
        image: 'https://static.lenskart.com/media/desktop/img/Jun23/Homepage-Banner/Vault-Banner-Desktop.jpg',
        badge: 'NEW ARRIVALS',
        color: 'text-blue-300',
    },
    {
        id: 2,
        tag: '☀️ SUMMER EDIT',
        title: 'Iconic Sunglasses',
        subtitle: 'Up to 60% OFF',
        description: 'Protect your eyes in style. Top brands: Ray-Ban, Oakley, Maui Jim & more.',
        cta: 'Shop Sunglasses',
        bg: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
        image: 'https://static.lenskart.com/media/desktop/img/Sep23/Sunglass-Dropdown/Ray-Ban-Dropdown.jpg',
        badge: 'BESTSELLERS',
        color: 'text-orange-300',
    },
    {
        id: 3,
        tag: '👁️ EYE CARE',
        title: 'Contact Lenses',
        subtitle: 'Comfort All Day',
        description: 'Monthly & daily disposables from Bausch & Lomb, Acuvue, Air Optix.',
        cta: 'Shop Lenses',
        bg: 'from-[#003333] via-[#004d4d] to-[#006666]',
        image: 'https://static.lenskart.com/media/desktop/img/contact-lens/BL-Jun-22/BL_DESKTOP.jpg',
        badge: 'DOCTOR RECOMMENDED',
        color: 'text-teal-300',
    },
    {
        id: 4,
        tag: '✨ CHIC STYLE',
        title: 'Trending Frames',
        subtitle: 'Fashion Forward',
        description: 'Level up your style with these trending frames. Stay chic, stay classy.',
        cta: 'Shop Trending',
        bg: 'from-[#0d4a70] via-[#105a8a] to-[#126b9f]',
        image: '/hero-1.png',
        badge: 'MUST HAVE',
        color: 'text-blue-200',
    },
    {
        id: 5,
        tag: '🍂 CLASSIC',
        title: 'Tortoiseshell',
        subtitle: 'Always in Style',
        description: 'Timeless patterns for a sophisticated everyday look. Ideal for work or play.',
        cta: 'Shop Classic',
        bg: 'from-[#5a3a22] via-[#6d462a] to-[#8a5a33]',
        image: '/hero-2.png',
        badge: 'NEW ARRIVALS',
        color: 'text-orange-200',
    },
];

const CATEGORIES = [
    { icon: <Eye size={28} />, label: 'Eyeglasses', href: '/products?category=eyeglasses', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
    { icon: <Sun size={28} />, label: 'Sunglasses', href: '/products?category=sunglasses', color: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
    { icon: <BookOpen size={28} />, label: 'Reading Glass', href: '/products?category=reading-glasses', color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
    { icon: <Monitor size={28} />, label: 'Computer Glass', href: '/products?category=computer-glasses', color: 'bg-green-50 text-green-700', border: 'border-green-200' },
    { icon: <Glasses size={28} />, label: 'Kids Eyewear', href: '/products?category=kids', color: 'bg-pink-50 text-pink-600', border: 'border-pink-200' },
    { icon: <Eye size={28} />, label: 'Contact Lenses', href: '/products?category=contact-lenses', color: 'bg-teal-50 text-teal-700', border: 'border-teal-200' },
];

const BRANDS = [
    { name: 'Ray-Ban', logo: 'https://static.lenskart.com/media/desktop/img/Sep23/Ray-Ban-Desktop.jpg' },
    { name: 'Oakley', logo: 'https://static.lenskart.com/media/desktop/img/Sep23/Oakley-Desktop.jpg' },
    { name: 'Vincent Chase', logo: 'https://static.lenskart.com/media/cache/slide/1100x400/catalog/Feb2022/thumbnail-1645093820.png' },
    { name: 'John Jacobs', logo: 'https://static.lenskart.com/media/desktop/img/Jun23/JJ-Banner/JJ-Banner-Desktop.jpg' },
];

const FEATURES = [
    { icon: <Truck size={24} />, title: 'Free Delivery', desc: 'On all orders above ₹999' },
    { icon: <Shield size={24} />, title: '1 Year Warranty', desc: 'On all frames & lenses' },
    { icon: <RefreshCw size={24} />, title: '14-Day Returns', desc: 'Easy hassle-free returns' },
    { icon: <Award size={24} />, title: 'Certified Quality', desc: 'ISI & UV400 certified' },
];

const Home = ({ addToCart, toggleWishlist, wishlist }) => {
    const [featured, setFeatured] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/products/featured');
                setFeatured(res.data.products || []);
            } catch (err) {
                console.error('Error fetching featured products:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 8000);
    };

    const slide = HERO_SLIDES[currentSlide];

    return (
        <main className="animate-fade-in">
            {/* ── HERO SECTION ── */}
            <section className={`relative bg-gradient-to-r ${slide.bg} overflow-hidden`} style={{ minHeight: '520px' }}>
                <div className="lk-container h-full">
                    <div className="flex flex-col md:flex-row items-center gap-8 py-12 md:py-20 min-h-[520px]">
                        {/* Text Content */}
                        <div className="flex-1 text-white z-10 animate-slide-up">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
                                <span>{slide.tag}</span>
                                <span className={`text-xs ${slide.color} font-black`}>{slide.badge}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-2">
                                {slide.title}
                            </h1>
                            <p className={`text-2xl md:text-3xl font-bold mb-4 ${slide.color}`}>
                                {slide.subtitle}
                            </p>
                            <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">
                                {slide.description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-teal text-white font-bold py-3 px-8 rounded-xl hover:bg-teal-700 transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center gap-2 text-lg"
                                >
                                    {slide.cta} <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/25 transition-all flex items-center gap-2"
                                >
                                    <Play size={16} fill="white" /> View Offers
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 mt-10">
                                {[
                                    { num: '5000+', label: 'Styles' },
                                    { num: '50+', label: 'Brands' },
                                    { num: '10M+', label: 'Customers' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <div className="text-2xl font-black text-white">{s.num}</div>
                                        <div className="text-xs text-white/60 font-medium">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-1 flex items-center justify-center relative">
                            <div className="relative w-full max-w-lg">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-2xl"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                {/* Floating badge */}
                                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-bounce-soft">
                                    SALE LIVE!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide Controls */}
                <button
                    onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-all"
                >
                    <ChevronLeft size={22} />
                </button>
                <button
                    onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-all"
                >
                    <ChevronRight size={22} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {HERO_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            className={`transition-all duration-300 rounded-full ${i === currentSlide ? 'bg-teal w-8 h-2' : 'bg-white/50 w-2 h-2 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </section>

            {/* ── TRUST BADGES ── */}
            <section className="bg-white border-b border-gray-100">
                <div className="lk-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                        {FEATURES.map((f, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 px-6 py-4 ${i < 3 ? 'border-r border-gray-100' : ''}`}
                            >
                                <div className="w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center text-teal shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-primary-900">{f.title}</div>
                                    <div className="text-xs text-gray-500">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SHOP BY CATEGORY ── */}
            <section className="py-16">
                <div className="lk-container">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <p className="text-teal text-sm font-bold uppercase tracking-widest mb-1">Browse</p>
                            <h2 className="section-title">Shop by <span>Category</span></h2>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-primary-900 font-bold hover:text-teal transition-colors">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.label}
                                to={cat.href}
                                className={`group flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border-2 ${cat.border} ${cat.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center`}
                            >
                                <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {cat.icon}
                                </div>
                                <span className="text-xs md:text-sm font-bold">{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROMO BANNER STRIP ── */}
            <section className="py-6">
                <div className="lk-container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { bg: 'from-purple-700 to-purple-900', title: '3D Try-On', sub: 'Try glasses virtually from home', emoji: '👓', cta: 'Try Now' },
                            { bg: 'from-teal-600 to-teal-800', title: 'Home Eye Checkup', sub: 'Free eye test at your doorstep', emoji: '🏠', cta: 'Book Free' },
                            { bg: 'from-orange-500 to-rose-600', title: 'Lenskart Gold', sub: 'Buy 1 Get 1 FREE on top brands', emoji: '⭐', cta: 'Join Now' },
                        ].map((banner, i) => (
                            <div key={i} className={`bg-gradient-to-br ${banner.bg} text-white rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                                <div className="text-4xl">{banner.emoji}</div>
                                <div className="flex-1">
                                    <div className="font-black text-lg">{banner.title}</div>
                                    <div className="text-white/75 text-sm mb-3">{banner.sub}</div>
                                    <button className="bg-white/25 hover:bg-white/40 transition-colors text-white text-xs font-bold px-4 py-1.5 rounded-full">
                                        {banner.cta} →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BESTSELLERS ── */}
            <section className="py-16 bg-white">
                <div className="lk-container">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <p className="text-teal text-sm font-bold uppercase tracking-widest mb-1">Trending Now</p>
                            <h2 className="section-title">Bestseller <span>Special</span></h2>
                        </div>
                        <Link to="/products" className="flex items-center gap-2 text-primary-900 font-bold hover:text-teal transition-colors">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {featured.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {featured.slice(0, 8).map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    addToCart={addToCart}
                                    toggleWishlist={toggleWishlist}
                                    isWishlisted={wishlist.includes(product.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-24">
                            <div className="spinner" />
                        </div>
                    )}
                </div>
            </section>

            {/* ── BRANDS ── */}
            <section className="py-16 bg-gray-50">
                <div className="lk-container">
                    <div className="text-center mb-10">
                        <p className="text-teal text-sm font-bold uppercase tracking-widest mb-1">Partnered With</p>
                        <h2 className="section-title">Top <span>Brands</span></h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {[
                            { name: 'Ray-Ban', emoji: '🕶️', color: 'bg-amber-50 border-amber-200' },
                            { name: 'Oakley', emoji: '⚡', color: 'bg-blue-50 border-blue-200' },
                            { name: 'Vincent Chase', emoji: '👓', color: 'bg-purple-50 border-purple-200' },
                            { name: 'John Jacobs', emoji: '✨', color: 'bg-rose-50 border-rose-200' },
                        ].map((brand) => (
                            <div
                                key={brand.name}
                                className={`${brand.color} border-2 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                            >
                                <div className="text-4xl mb-3">{brand.emoji}</div>
                                <div className="font-black text-primary-900 text-lg text-center">{brand.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LENSKART GOLD MEMBERSHIP ── */}
            <section className="py-16">
                <div className="lk-container">
                    <div className="relative bg-gradient-to-r from-[#000042] via-[#000070] to-[#000042] rounded-3xl overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full translate-x-1/3 -translate-y-1/3" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal rounded-full -translate-x-1/3 translate-y-1/3" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-14">
                            <div className="flex-1 text-white">
                                <div className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full mb-6">
                                    ⭐ LENSKART GOLD
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                                    Premium Perks<br />
                                    <span className="text-yellow-400">Wait For You</span>
                                </h2>
                                <ul className="space-y-3 mb-8">
                                    {[
                                        'Buy 1 Get 1 FREE on top brands',
                                        'Free Home Eye Checkup (worth ₹500)',
                                        'Early access to sales & new arrivals',
                                        'VIP customer support 24/7',
                                    ].map(perk => (
                                        <li key={perk} className="flex items-center gap-3 text-white/80">
                                            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-black text-[10px] font-black">✓</span>
                                            </div>
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                                <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3.5 px-8 rounded-xl transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center gap-2 text-lg">
                                    Join Gold — ₹999/yr <ArrowRight size={18} />
                                </button>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <img
                                    src="https://static.lenskart.com/media/desktop/img/Oct22/gold-membership/gold-desktop.jpg"
                                    alt="Lenskart Gold"
                                    className="w-full max-w-sm rounded-2xl shadow-2xl"
                                    onError={e => e.target.style.display = 'none'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-16 bg-white">
                <div className="lk-container">
                    <div className="text-center mb-10">
                        <p className="text-teal text-sm font-bold uppercase tracking-widest mb-1">Reviews</p>
                        <h2 className="section-title">What Our <span>Customers Say</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Priya S.', city: 'Mumbai', stars: 5, text: '"Amazing quality! Got my eyeglasses in 2 days with free home delivery. The 3D try-on feature is a game-changer!"', avatar: 'P' },
                            { name: 'Rahul K.', city: 'Delhi', stars: 5, text: '"Lenskart Gold is totally worth it. Got 2 pairs of premium Ray-Bans at the price of 1. Will definitely recommend!"', avatar: 'R' },
                            { name: 'Sneha M.', city: 'Bangalore', stars: 5, text: '"Best eyewear shopping experience in India. Free home eye checkup was so convenient. 5 stars all the way!"', avatar: 'S' },
                        ].map((review, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-card transition-shadow">
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(review.stars)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.text}</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-primary-900 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-primary-900">{review.name}</div>
                                        <div className="text-xs text-gray-500">{review.city} • Verified Buyer</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── APP DOWNLOAD CTA ── */}
            <section className="py-12 bg-gradient-to-r from-teal-700 to-teal-600">
                <div className="lk-container">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">📱</div>
                            <div>
                                <h3 className="text-2xl font-black">Download the Lenskart App</h3>
                                <p className="text-teal-100 text-sm">Exclusive app-only deals & faster checkout</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {['App Store', 'Google Play'].map(store => (
                                <button key={store} className="flex items-center gap-2 bg-white text-primary-900 font-bold px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                                    <Phone size={18} />
                                    {store}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
