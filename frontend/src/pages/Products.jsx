import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';

const SHAPES = ['Rectangle', 'Round', 'Oval', 'Square', 'Cat-Eye', 'Wayfarer', 'Rimless'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];
const PRICE_RANGES = [
    { label: 'Under ₹1000', min: 0, max: 1000 },
    { label: '₹1000 – ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 – ₹5000', min: 2000, max: 5000 },
    { label: 'Above ₹5000', min: 5000, max: Infinity },
];

const Products = ({ toggleWishlist, wishlist, addToCart }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState('popularity');
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [priceRange, setPriceRange] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `/api/products?limit=100&`;
                if (category !== 'all') url += `category=${category}&`;
                if (search) url += `search=${search}&`;
                const res = await axios.get(url);
                if (res.data.success) {
                    setProducts(res.data.products);
                    setTotal(res.data.total);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
        window.scrollTo(0, 0);
    }, [category, search]);

    const filteredProducts = products
        .filter(p => {
            if (selectedShapes.length && !selectedShapes.includes(p.frameShape)) return false;
            if (selectedGenders.length && !selectedGenders.includes(p.gender)) return false;
            if (priceRange && (p.price < priceRange.min || p.price > priceRange.max)) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });

    const toggleFilter = (list, setList, value) => {
        setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };

    const clearAll = () => {
        setSelectedShapes([]);
        setSelectedGenders([]);
        setPriceRange(null);
    };

    const activeFilterCount = selectedShapes.length + selectedGenders.length + (priceRange ? 1 : 0);

    const FilterSidebar = () => (
        <aside className="w-full">
            {/* Frame Shape */}
            <div className="bg-white rounded-2xl p-5 mb-4 shadow-card">
                <h4 className="font-black text-primary-900 text-sm uppercase tracking-wider mb-4">Frame Shape</h4>
                <div className="space-y-2.5">
                    {SHAPES.map(shape => (
                        <label key={shape} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedShapes.includes(shape)}
                                onChange={() => toggleFilter(selectedShapes, setSelectedShapes, shape)}
                                className="w-4 h-4 accent-teal cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-600 group-hover:text-primary-900 transition-colors">{shape}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Gender */}
            <div className="bg-white rounded-2xl p-5 mb-4 shadow-card">
                <h4 className="font-black text-primary-900 text-sm uppercase tracking-wider mb-4">Gender</h4>
                <div className="grid grid-cols-2 gap-2">
                    {GENDERS.map(g => (
                        <button
                            key={g}
                            onClick={() => toggleFilter(selectedGenders, setSelectedGenders, g)}
                            className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedGenders.includes(g)
                                ? 'bg-primary-900 text-white border-primary-900'
                                : 'border-gray-100 text-gray-600 hover:border-primary-900'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
                <h4 className="font-black text-primary-900 text-sm uppercase tracking-wider mb-4">Price Range</h4>
                <div className="space-y-2">
                    {PRICE_RANGES.map(range => (
                        <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="price"
                                checked={priceRange?.label === range.label}
                                onChange={() => setPriceRange(range)}
                                className="w-4 h-4 accent-teal"
                            />
                            <span className="text-sm font-medium text-gray-600 group-hover:text-primary-900 transition-colors">{range.label}</span>
                        </label>
                    ))}
                    {priceRange && (
                        <button onClick={() => setPriceRange(null)} className="text-xs text-red-500 font-semibold mt-1 hover:underline">
                            Clear price filter
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );

    return (
        <main className="animate-fade-in">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-primary-900 to-[#000070] text-white py-10">
                <div className="lk-container">
                    <div className="text-blue-300 text-sm mb-1 font-medium">
                        Home / {category !== 'all' ? category.replace(/-/g, ' ') : 'All Products'}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black capitalize">
                        {search ? `Search: "${search}"` : category !== 'all' ? category.replace(/-/g, ' ') : 'All Products'}
                    </h1>
                    <p className="text-blue-200 text-sm mt-2">
                        {loading ? 'Loading...' : `${filteredProducts.length} products found`}
                    </p>
                </div>
            </div>

            <div className="lk-container py-8">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-primary-900 transition-colors"
                    >
                        <SlidersHorizontal size={16} />
                        Filters {activeFilterCount > 0 && <span className="bg-teal text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                    </button>

                    {activeFilterCount > 0 && (
                        <button onClick={clearAll} className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:underline">
                            <X size={14} /> Clear all filters
                        </button>
                    )}

                    <div className="ml-auto flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                            <span>{filteredProducts.length} of {total} results</span>
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-8 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary-900 transition-colors bg-white"
                            >
                                <option value="popularity">Sort: Popularity</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Best Rated</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block w-64 shrink-0">
                        <FilterSidebar />
                    </div>

                    {/* Mobile Filter Panel */}
                    {showFilters && (
                        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)}>
                            <div className="absolute left-0 top-0 h-full w-80 bg-gray-50 overflow-y-auto p-4" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-primary-900">Filters</h3>
                                    <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                                </div>
                                <FilterSidebar />
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-32">
                                <div className="spinner" />
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map(p => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        toggleWishlist={toggleWishlist}
                                        wishlist={wishlist}
                                        isWishlisted={wishlist.includes(p.id)}
                                        addToCart={addToCart}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="text-7xl mb-5">🔎</div>
                                <h3 className="text-2xl font-black text-primary-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                                <button onClick={clearAll} className="btn-primary">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Products;
