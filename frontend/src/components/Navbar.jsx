import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Heart, ShoppingCart, User, LogOut, Menu, X,
    Phone, ChevronDown, MapPin
} from 'lucide-react';

const Navbar = ({ cartCount, wishlistCount, user, onOpenCart, onOpenAuth, onLogout }) => {
    const [search, setSearch] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/products?search=${search}`);
    };

    const categories = [
        { label: 'Eyeglasses', href: '/products?category=eyeglasses' },
        { label: 'Sunglasses', href: '/products?category=sunglasses' },
        { label: 'Reading Glasses', href: '/products?category=reading-glasses' },
        { label: 'Computer Glasses', href: '/products?category=computer-glasses' },
        { label: 'Contact Lenses', href: '/products?category=contact-lenses' },
        { label: 'Kids Eyewear', href: '/products?category=kids' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Top Announcement Bar */}
            <div className="bg-primary-900 text-white text-xs py-2 overflow-hidden">
                <div className="marquee-inner">
                    {[...Array(2)].map((_, i) => (
                        <span key={i} className="flex items-center gap-8 px-4">
                            <span>🎉 FREE Delivery on your first order!</span>
                            <span>|</span>
                            <span>Use Code: <strong className="text-yellow-300">WELCOME70</strong> for 70% OFF</span>
                            <span>|</span>
                            <span>📞 Call us: 9493862095</span>
                            <span>|</span>
                            <span>🚚 Free Home Eye Checkup — Book Now</span>
                            <span>|</span>
                            <span>⭐ Buy 1 Get 1 FREE on Premium Brands</span>
                            <span>|</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Nav */}
            <nav className="bg-white shadow-nav">
                <div className="lk-container">
                    <div className="flex items-center gap-4 py-3">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 shrink-0 group">
                            <div className="w-9 h-9 rounded-full border-2 border-primary-900 flex items-center justify-center group-hover:bg-primary-900 transition-colors duration-200">
                                <svg viewBox="0 0 100 100" fill="none" className="w-5 h-5 text-primary-900 group-hover:text-white transition-colors duration-200" stroke="currentColor">
                                    <circle cx="50" cy="50" r="40" strokeWidth="8" />
                                    <path d="M25 50 H75 M25 50 C25 38 35 32 50 32 C65 32 75 38 75 50" strokeWidth="7" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-xl font-black text-primary-900 tracking-tight">BEST VISION</span>
                                <div className="text-[8px] font-bold text-teal tracking-widest uppercase -mt-1">Opticals</div>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
                            <div className="flex w-full border-2 border-gray-200 rounded-xl overflow-hidden hover:border-teal focus-within:border-teal transition-colors duration-200 shadow-sm">
                                <select className="px-3 py-2.5 text-xs font-semibold bg-gray-50 text-gray-600 border-r border-gray-200 outline-none cursor-pointer">
                                    <option>All</option>
                                    <option>Eyeglasses</option>
                                    <option>Sunglasses</option>
                                    <option>Contact Lenses</option>
                                </select>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search eyeglasses, sunglasses, brands..."
                                    className="flex-1 px-4 py-2.5 text-sm outline-none bg-white"
                                />
                                <button type="submit" className="px-5 bg-teal text-white hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2 font-semibold text-sm">
                                    <Search size={16} />
                                </button>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 ml-auto">
                            {/* Store Locator */}
                            <button className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary-900 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                                <MapPin size={15} className="text-teal" />
                                <div className="text-left">
                                    <div className="text-[10px] text-gray-400">Find Store</div>
                                    <div>Near Me</div>
                                </div>
                            </button>

                            {/* Wishlist */}
                            <Link to="/wishlist" className="nav-icon-btn">
                                <Heart size={22} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <button className="nav-icon-btn" onClick={onOpenCart}>
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-teal text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Auth */}
                            {user ? (
                                <div className="flex items-center gap-2 ml-1">
                                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=000042&color=fff`}
                                            className="w-7 h-7 rounded-full object-cover"
                                            alt={user.name}
                                        />
                                        <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="nav-icon-btn text-red-400 hover:text-red-600 hover:bg-red-50"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onOpenAuth}
                                    className="ml-2 flex items-center gap-2 px-4 py-2 bg-primary-900 text-white text-sm font-bold rounded-xl hover:bg-primary-800 transition-colors"
                                >
                                    <User size={16} />
                                    <span className="hidden sm:inline">Login</span>
                                </button>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="nav-icon-btn md:hidden ml-1"
                            >
                                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="md:hidden pb-3 flex gap-2">
                        <div className="flex flex-1 border-2 border-gray-200 rounded-xl overflow-hidden">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search eyeglasses, sunglasses..."
                                className="flex-1 px-4 py-2.5 text-sm outline-none"
                            />
                            <button type="submit" className="px-4 bg-teal text-white flex items-center">
                                <Search size={16} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Category Nav */}
                <div className="border-t border-gray-100">
                    <div className="lk-container">
                        <div className="hidden md:flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
                            <Link
                                to="/products"
                                className="shrink-0 px-4 py-1.5 text-sm font-semibold text-primary-900 hover:text-teal transition-colors duration-200 whitespace-nowrap"
                            >
                                All Products
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.href}
                                    to={cat.href}
                                    className="shrink-0 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:text-teal transition-colors duration-200 whitespace-nowrap"
                                >
                                    {cat.label}
                                </Link>
                            ))}
                            <div className="ml-auto shrink-0">
                                <Link
                                    to="/admin"
                                    className="px-4 py-1.5 text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors whitespace-nowrap"
                                >
                                    ⚙ Admin Panel
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
                    <div className="lk-container py-4 flex flex-col gap-2">
                        <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="py-2 font-semibold text-primary-900 border-b border-gray-100">All Products</Link>
                        {categories.map(cat => (
                            <Link
                                key={cat.href}
                                to={cat.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 text-gray-700 font-medium border-b border-gray-100"
                            >
                                {cat.label}
                            </Link>
                        ))}
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-yellow-600">⚙ Admin Panel</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
