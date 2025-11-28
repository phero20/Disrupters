import React, { useState } from 'react';
import {
    ArrowRight,
    Target,
    X,
    Mail,
    Lock,
    User,
    Activity,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const { login, signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let result;
            if (isSignUp) {
                result = await signup(formData.fullname, formData.email, formData.password);
            } else {
                result = await login(formData.email, formData.password);
            }

            if (result.success) {
                navigate('/dashboard');
                onClose();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-background/30 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                                mass: 0.8
                            }}
                            className="bg-card text-card-foreground rounded-xl shadow-2xl w-full max-w-md p-8 relative pointer-events-auto border border-border overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors cursor-pointer z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                                >
                                    <div className={`p-2 rounded-lg transition-colors duration-300 bg-primary/10 text-primary border border-border`}>
                                        <Activity size={28} className="group-hover:animate-pulse" />
                                    </div>

                                </motion.div>

                            </div>

                            {/* Social Login */}
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-3 bg-background border border-input text-foreground font-medium py-2.5 rounded-lg transition-colors mb-6 group cursor-pointer relative overflow-hidden hover:bg-accent hover:text-accent-foreground"
                            >
                                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="relative z-10">Continue with Google</span>
                            </motion.button>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with email</span>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <AnimatePresence mode="popLayout">
                                    {isSignUp && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, y: -10 }}
                                            animate={{ height: "auto", opacity: 1, y: 0 }}
                                            exit={{ height: 0, opacity: 0, y: -10 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-1">
                                                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1.5">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        name="fullname"
                                                        value={formData.fullname}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                                        placeholder="John Doe"
                                                        required={isSignUp}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div layout>
                                    <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                            placeholder="student@example.com"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div layout>
                                    <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-destructive text-xs text-center font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <motion.button
                                    layout
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg cursor-pointer hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/10 flex justify-center items-center gap-2 group mt-2"
                                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {isSignUp ? 'Create Account' : 'Sign In'}
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <motion.div layout className="text-center mt-6 text-sm text-muted-foreground">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                <button
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setError('');
                                    }}
                                    className="text-primary font-bold hover:underline focus:outline-none cursor-pointer"
                                >
                                    {isSignUp ? 'Log in' : 'Sign up'}
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;