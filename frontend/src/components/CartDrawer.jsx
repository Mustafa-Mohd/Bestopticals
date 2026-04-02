import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cart, onRemove }) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const savings = cart.reduce((sum, item) => sum + (Math.round(item.price * 0.4) * item.quantity), 0);

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-primary-900 text-white">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={22} />
                        <div>
                            <h3 className="font-black text-lg">Shopping Cart</h3>
                            <p className="text-blue-200 text-xs">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                                <ShoppingBag size={40} className="text-gray-300" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h4>
                            <p className="text-gray-500 text-sm mb-6">Add some amazing eyewear to get started!</p>
                            <button
                                onClick={onClose}
                                className="btn-primary"
                            >
                                Start Shopping <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item, index) => (
                                <div
                                    key={`${item.id}-${item.lens}-${index}`}
                                    className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-teal/30 transition-colors"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-16 bg-white rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 border border-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                            onError={e => e.target.src = `https://placehold.co/80x60/f1f5f9/94a3b8?text=IMG`}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-primary-900 truncate">{item.name}</div>
                                        <div className="text-[11px] text-teal font-bold mt-0.5">{item.lens}</div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div>
                                                <span className="text-sm font-black text-primary-900">₹{item.price?.toLocaleString()}</span>
                                                <span className="text-xs text-gray-400 ml-1.5">× {item.quantity}</span>
                                            </div>
                                            <span className="text-sm font-black text-primary-900">
                                                ₹{(item.price * item.quantity)?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => onRemove(item.id, item.lens)}
                                        className="self-start p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-5">
                        {savings > 0 && (
                            <div className="flex items-center justify-between mb-2 text-green-600 text-sm font-semibold">
                                <span>🎉 You're saving</span>
                                <span className="font-black">₹{savings.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-lg font-bold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-black text-primary-900">₹{total.toLocaleString()}</span>
                        </div>

                        <button className="w-full bg-primary-900 hover:bg-primary-800 text-white font-black py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 text-lg mb-3">
                            Proceed to Checkout <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:border-primary-900 hover:text-primary-900 transition-colors text-sm"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
