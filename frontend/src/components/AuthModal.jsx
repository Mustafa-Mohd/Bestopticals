import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({
            name: isLogin ? email.split('@')[0] : name,
            email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isLogin ? email.split('@')[0] : name)}&background=000042&color=fff`
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary-900 to-[#000070] p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" fill="none" className="w-6 h-6" stroke="white">
                                <circle cx="50" cy="50" r="40" strokeWidth="8" />
                                <path d="M25 50 H75 M25 50 C25 38 35 32 50 32 C65 32 75 38 75 50" strokeWidth="7" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="font-black text-xl tracking-tight">BEST VISION</span>
                    </div>
                    <h2 className="text-2xl font-black mt-4">{isLogin ? 'Welcome back!' : 'Create Account'}</h2>
                    <p className="text-blue-200 text-sm mt-1">
                        {isLogin ? 'Sign in to access your orders & wishlist.' : 'Join millions of happy customers.'}
                    </p>
                </div>

                {/* Toggle Tabs */}
                <div className="flex border-b border-gray-100">
                    {['Login', 'Sign Up'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setIsLogin(tab === 'Login')}
                            className={`flex-1 py-3.5 text-sm font-bold transition-all duration-200 ${(isLogin && tab === 'Login') || (!isLogin && tab === 'Sign Up')
                                ? 'text-teal border-b-2 border-teal'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-7 space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="input-field pl-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div className="text-right">
                            <button type="button" className="text-xs font-semibold text-teal hover:underline">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary-900 hover:bg-primary-800 text-white font-black py-4 rounded-xl transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 text-base mt-2"
                    >
                        {isLogin ? 'Login to Account' : 'Create Account'} <ArrowRight size={18} />
                    </button>

                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="text-xs text-gray-400 shrink-0">or continue with</span>
                        <div className="flex-1 border-t border-gray-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {['Google', 'Apple'].map(provider => (
                            <button
                                key={provider}
                                type="button"
                                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                                {provider === 'Google' ? '🔴' : '🍎'} {provider}
                            </button>
                        ))}
                    </div>

                    <p className="text-center text-xs text-gray-500 pt-1">
                        By continuing, you agree to Best Vision Opticals'{' '}
                        <button type="button" className="text-teal font-semibold hover:underline">Terms of Service</button>
                        {' & '}
                        <button type="button" className="text-teal font-semibold hover:underline">Privacy Policy</button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
