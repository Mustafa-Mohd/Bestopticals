import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, ChevronRight, Minus, Plus } from 'lucide-react';

const LENS_TYPES = [
    { type: 'Zero Power', desc: 'No prescription needed', price: '₹0' },
    { type: 'Single Vision', desc: 'For near or far sightedness', price: '+₹599' },
    { type: 'Bifocal', desc: 'For both near & far vision', price: '+₹799' },
];

const ProductDetails = ({ addToCart, toggleWishlist, wishlist }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLens, setSelectedLens] = useState('Zero Power');
    const [activeTab, setActiveTab] = useState(0);
    const [qty, setQty] = useState(1);
    const [pincode, setPincode] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/products/${id}`);
                if (res.data.success) {
                    setProduct(res.data.product);
                    setRelated(res.data.related || []);
                }
            } catch (err) {
                console.error('Error fetching product details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center py-40">
            <div className="spinner" />
        </div>
    );

    if (!product) return (
        <div className="lk-container py-24 text-center">
            <div className="text-7xl mb-5">😕</div>
            <h2 className="text-3xl font-black mb-4">Product Not Found</h2>
            <Link to="/products" className="btn-primary">Browse All Products</Link>
        </div>
    );

    const isWishlisted = wishlist.includes(product.id);
    const originalPrice = Math.round(product.price * 1.5);

    return (
        <main className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="lk-container py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-primary-900 transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/products" className="hover:text-primary-900 transition-colors">Products</Link>
                    <ChevronRight size={14} />
                    <span className="text-primary-900 font-semibold truncate">{product.name}</span>
                </div>
            </div>

            <div className="lk-container py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* ── LEFT: Gallery ── */}
                    <div className="flex gap-4">
                        {/* Thumbnails */}
                        <div className="flex flex-col gap-3">
                            {[0, 45, 90].map((angle, i) => (
                                <div
                                    key={i}
                                    className="w-16 h-16 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer hover:border-teal transition-colors"
                                >
                                    <img
                                        src={Array.isArray(product.images) ? product.images[0] : (product.images || product.image)}
                                        alt=""
                                        className="w-full h-full object-contain"
                                        style={{ transform: `rotate(${angle}deg)` }}
                                        onError={e => e.target.style.opacity = '0.3'}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-3xl flex items-center justify-center p-10 relative min-h-[340px] group">
                            <img
                                src={Array.isArray(product.images) ? product.images[0] : (product.images || product.image)}
                                alt={product.name}
                                className="w-full max-h-72 object-contain transition-transform duration-500 group-hover:scale-105"
                                onError={e => e.target.src = `https://placehold.co/400x300/f8fafc/94a3b8?text=${encodeURIComponent(product.name)}`}
                            />
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isBestSeller && (
                                    <span className="bg-primary-900 text-white text-xs font-black px-2.5 py-1 rounded-lg">BESTSELLER</span>
                                )}
                                {product.category === 'eyeglasses' && (
                                    <button
                                        onClick={() => window.dispatchEvent(new CustomEvent('open-try-on', { detail: product }))}
                                        className="bg-teal text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5"
                                    >
                                        <span className="animate-pulse">✨</span> 3D TRY-ON
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Info ── */}
                    <div>
                        {/* Brand & Name */}
                        <div className="text-teal text-xs font-black uppercase tracking-widest mb-2">{product.brand}</div>
                        <h1 className="text-2xl md:text-3xl font-black text-primary-900 leading-tight mb-3">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <div className="flex items-center gap-1.5 bg-green-100 px-2.5 py-1 rounded-lg">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'} />
                                    ))}
                                </div>
                                <span className="text-green-800 text-xs font-black">{product.rating || '4.0'}</span>
                            </div>
                            <span className="text-gray-500 text-sm">{product.reviews || 128} Reviews</span>
                            <span className="text-green-600 text-sm font-bold">✓ In Stock</span>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-6">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-3xl font-black text-primary-900">₹{product.price?.toLocaleString()}</span>
                                <span className="text-xl text-gray-400 line-through">₹{originalPrice?.toLocaleString()}</span>
                                <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-md">50% OFF</span>
                            </div>
                            <p className="text-green-700 text-sm font-semibold">
                                🎉 You save ₹{(originalPrice - product.price)?.toLocaleString()} on this purchase!
                            </p>
                        </div>

                        {/* Specs Grid */}
                        {(product.frameShape || product.material || product.gender) && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { label: 'Shape', value: product.frameShape },
                                    { label: 'Material', value: product.material },
                                    { label: 'Gender', value: product.gender },
                                ].filter(s => s.value).map(spec => (
                                    <div key={spec.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{spec.label}</div>
                                        <div className="text-sm font-black text-primary-900 mt-0.5">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Lens Selector */}
                        <div className="mb-6">
                            <h4 className="font-black text-primary-900 text-sm uppercase tracking-wider mb-3">Select Lens Type</h4>
                            <div className="flex flex-col gap-2.5">
                                {LENS_TYPES.map(lens => (
                                    <label
                                        key={lens.type}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedLens === lens.type
                                            ? 'border-primary-900 bg-primary-900/5'
                                            : 'border-gray-100 hover:border-primary-900/40'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedLens === lens.type ? 'border-primary-900' : 'border-gray-300'}`}>
                                                {selectedLens === lens.type && <div className="w-2.5 h-2.5 bg-primary-900 rounded-full" />}
                                            </div>
                                            <input type="radio" name="lens" className="sr-only" checked={selectedLens === lens.type} onChange={() => setSelectedLens(lens.type)} />
                                            <div>
                                                <div className="font-bold text-sm text-primary-900">{lens.type}</div>
                                                <div className="text-gray-500 text-xs">{lens.desc}</div>
                                            </div>
                                        </div>
                                        <span className="text-teal font-black text-sm">{lens.price}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-bold text-gray-700">Quantity:</span>
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="px-5 py-2.5 font-black text-primary-900 text-base">{qty}</span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => addToCart(product, selectedLens)}
                                className="flex-1 bg-primary-900 hover:bg-primary-800 text-white font-black py-4 rounded-2xl transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-3 text-base"
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 hover:scale-105 ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500'}`}
                            >
                                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Pincode Check */}
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                placeholder="Enter pincode for delivery estimate"
                                value={pincode}
                                onChange={e => setPincode(e.target.value)}
                                maxLength={6}
                                className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors"
                            />
                            <button className="px-4 py-2.5 border-2 border-primary-900 text-primary-900 font-bold text-sm rounded-xl hover:bg-primary-900 hover:text-white transition-all">
                                Check
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
                            {[
                                { icon: <Truck size={18} className="text-teal" />, text: 'Free Delivery' },
                                { icon: <Shield size={18} className="text-teal" />, text: '1 Yr Warranty' },
                                { icon: <RefreshCw size={18} className="text-teal" />, text: '14D Returns' },
                            ].map((t, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 text-center">
                                    <div className="w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center">{t.icon}</div>
                                    <span className="text-xs font-semibold text-gray-600">{t.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── TABS: Description / Specs / Reviews ── */}
                <div className="mt-14 bg-white rounded-3xl shadow-card overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        {['Description', 'Specifications', 'Reviews (128)'].map((tab, i) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(i)}
                                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === i
                                    ? 'text-teal border-b-2 border-teal bg-teal/5'
                                    : 'text-gray-500 hover:text-primary-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="p-8">
                        {activeTab === 0 && (
                            <p className="text-gray-600 leading-relaxed text-base">
                                Experience the ultimate in eyewear luxury. This {product.frameShape || ''} frame is crafted from premium{' '}
                                {product.material || 'acetate'} materials, ensuring durability and style. Designed for both aesthetics and
                                comfort, these glasses provide UV400 protection and are suitable for all face shapes. Perfect for daily wear and
                                formal occasions alike. Each pair comes with a premium hard case and cleaning cloth.
                            </p>
                        )}
                        {activeTab === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    ['Frame Shape', product.frameShape || 'Rectangle'],
                                    ['Material', product.material || 'Acetate'],
                                    ['Gender', product.gender || 'Unisex'],
                                    ['Brand', product.brand || '-'],
                                    ['Lens Width', '52mm'],
                                    ['Bridge Width', '18mm'],
                                    ['Temple Length', '145mm'],
                                    ['Weight', '22g'],
                                    ['UV Protection', 'UV400'],
                                ].map(([key, val]) => (
                                    <div key={key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{key}</div>
                                        <div className="text-sm font-black text-primary-900 mt-1">{val}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 2 && (
                            <div className="space-y-5">
                                {[
                                    { name: 'Arjun M.', stars: 5, comment: 'Amazing quality! Perfect fit and very stylish. Got many compliments already.', date: '2 days ago' },
                                    { name: 'Priya K.', stars: 5, comment: 'Fast delivery, excellent packaging. The glasses look exactly like in the pictures!', date: '1 week ago' },
                                    { name: 'Rohit S.', stars: 4, comment: 'Good quality for the price. Very comfortable to wear for long hours.', date: '2 weeks ago' },
                                ].map((review, i) => (
                                    <div key={i} className="pb-5 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center text-white text-xs font-black">{review.name[0]}</div>
                                            <div>
                                                <div className="text-sm font-bold text-primary-900">{review.name}</div>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(review.stars)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                                                </div>
                                            </div>
                                            <span className="ml-auto text-xs text-gray-400">{review.date}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm pl-11">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RELATED PRODUCTS ── */}
                {related.length > 0 && (
                    <section className="mt-14">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="section-title">You May Also <span>Like</span></h2>
                            <Link to="/products" className="text-primary-900 font-bold hover:text-teal transition-colors text-sm flex items-center gap-1">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {related.slice(0, 4).map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    addToCart={addToCart}
                                    toggleWishlist={toggleWishlist}
                                    isWishlisted={wishlist.includes(p.id)}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export default ProductDetails;
