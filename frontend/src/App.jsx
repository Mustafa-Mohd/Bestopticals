import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import VirtualTryOn from './components/VirtualTryOn';
import SnapchatFilterTryOn from './components/SnapchatFilterTryOn';
import About from './pages/About';

function App() {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('lk_cart')) || []);
    const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('lk_wishlist')) || []);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [tryOnProduct, setTryOnProduct] = useState(null);
    const [snapchatProduct, setSnapchatProduct] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('lk_user')) || null);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleOpenTryOn = (e) => {
            setTryOnProduct(e.detail);
        };
        const handleOpenSnapchat = (e) => {
            setSnapchatProduct(e.detail);
        };
        window.addEventListener('open-try-on', handleOpenTryOn);
        window.addEventListener('open-snapchat-filter', handleOpenSnapchat);
        return () => {
            window.removeEventListener('open-try-on', handleOpenTryOn);
            window.removeEventListener('open-snapchat-filter', handleOpenSnapchat);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('lk_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('lk_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const addToCart = (product, lens = 'Zero Power') => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.lens === lens);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.lens === lens)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, lens }];
        });
        showToast('Added to cart! 🛒');
        setIsCartOpen(true);
    };

    const removeFromCart = (id, lens) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.lens === lens)));
        showToast('Removed from cart', 'warning');
    };

    const toggleWishlist = (id) => {
        setWishlist(prev => {
            if (prev.includes(id)) {
                showToast('Removed from wishlist', 'warning');
                return prev.filter(i => i !== id);
            }
            showToast('Saved to wishlist! ❤️');
            return [...prev, id];
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar
                cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                wishlistCount={wishlist.length}
                user={user}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                onLogout={() => {
                    setUser(null);
                    localStorage.removeItem('lk_user');
                    showToast('Logged out successfully', 'info');
                }}
            />

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Home addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
                    <Route path="/products" element={<Products toggleWishlist={toggleWishlist} wishlist={wishlist} addToCart={addToCart} />} />
                    <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
                    <Route path="/wishlist" element={<Wishlist addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>

            <Footer />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onRemove={removeFromCart}
            />

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onLogin={(userData) => {
                    setUser(userData);
                    localStorage.setItem('lk_user', JSON.stringify(userData));
                    setIsAuthOpen(false);
                    showToast(`Welcome back, ${userData.name}! 👋`);
                }}
            />

            {tryOnProduct && (
                <VirtualTryOn
                    product={tryOnProduct}
                    onClose={() => setTryOnProduct(null)}
                />
            )}

            {snapchatProduct && (
                <SnapchatFilterTryOn
                    product={snapchatProduct}
                    onClose={() => setSnapchatProduct(null)}
                />
            )}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
                {toasts.map(t => <Toast key={t.id} {...t} />)}
            </div>
        </div>
    );
}

export default App;
