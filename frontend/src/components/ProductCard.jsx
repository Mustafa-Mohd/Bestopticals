import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product, addToCart, toggleWishlist, isWishlisted }) => {
    const originalPrice = Math.round(product.price * 1.4);
    const discountPct = product.discount || 40;

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => {
            const filled = i + 1 <= Math.floor(rating);
            const half = !filled && i < rating;
            return (
                <Star
                    key={i}
                    size={12}
                    className={filled || half ? 'text-yellow-400' : 'text-gray-200'}
                    fill={filled ? 'currentColor' : 'none'}
                />
            );
        });
    };

    return (
        <div className="product-card group">
            {/* Image area */}
            <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Link to={`/product/${product.id}`} className="flex items-center justify-center h-full p-4">
                    <img
                        src={Array.isArray(product.images) ? product.images[0] : (product.images || product.image)}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = `https://placehold.co/300x200/f1f5f9/94a3b8?text=${encodeURIComponent(product.name)}`;
                        }}
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isBestSeller && (
                        <span className="bg-primary-900 text-white text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md shadow">
                            Bestseller
                        </span>
                    )}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-try-on', { detail: product })); }}
                        className="bg-teal/90 hover:bg-teal backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow flex items-center gap-1.5 transition-all hover:scale-105"
                    >
                        <span className="animate-pulse">✨</span> 3D Try-On
                    </button>
                </div>

                {/* Discount badge */}
                <div className="absolute top-3 right-10 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    -{discountPct}%
                </div>

                {/* Wishlist btn */}
                <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full shadow flex items-center justify-center transition-all duration-200 hover:scale-110
                        ${isWishlisted
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                >
                    <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                        <ShoppingCart size={15} />
                        Quick Add to Cart
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-1 flex-1">
                <div className="text-[11px] font-black text-teal uppercase tracking-wider">{product.brand}</div>
                <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-bold text-primary-900 hover:text-teal transition-colors line-clamp-2 leading-snug"
                >
                    {product.name}
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex">{renderStars(product.rating || 4)}</div>
                    <span className="text-xs font-semibold text-gray-500">{product.rating || '4.0'}</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-black text-primary-900">₹{product.price?.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">₹{originalPrice?.toLocaleString()}</span>
                </div>

                {/* Add to Cart btn (visible without hover on mobile) */}
                <button
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full py-2.5 text-sm font-bold border-2 border-primary-900 text-primary-900 rounded-xl hover:bg-primary-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 md:hidden"
                >
                    <ShoppingCart size={15} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
