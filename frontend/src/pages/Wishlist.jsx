import { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Wishlist = ({ toggleWishlist, wishlist, addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (wishlist.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const promises = wishlist.map(id => axios.get(`/api/products/${id}`));
                const results = await Promise.all(promises);
                setProducts(results.map(r => r.data.product).filter(Boolean));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [wishlist]);

    return (
        <main className="animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-900 to-[#000070] text-white py-10">
                <div className="lk-container">
                    <div className="flex items-center gap-3 mb-1">
                        <Heart size={22} className="text-red-400" />
                        <h1 className="text-3xl font-black">My Wishlist</h1>
                    </div>
                    <p className="text-blue-200 text-sm">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later</p>
                </div>
            </div>

            <div className="lk-container py-10">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="spinner" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map(p => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                toggleWishlist={toggleWishlist}
                                isWishlisted={true}
                                addToCart={addToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <Heart size={52} className="text-red-200" />
                        </div>
                        <h3 className="text-2xl font-black text-primary-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            Save your favourite eyewear styles and find them easily later.
                        </p>
                        <Link to="/products" className="btn-primary text-lg py-4 px-8 gap-3">
                            Explore Products <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Wishlist;
