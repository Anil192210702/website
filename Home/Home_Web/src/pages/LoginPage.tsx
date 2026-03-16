import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { authApi } from '../services/api';

// Logo Imports
import simatsLogo from '../assets/simats_logo.jpeg';
import interfaceLogo from '../assets/interface_logo.jpeg';
import simatsImage from '../assets/simats.jpeg';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setUserName, updateProfile } = useProject();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please fill all fields');
            return;
        }
        if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
            setError('Only @gmail.com email addresses are accepted');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.login({
                email: email.trim().toLowerCase(),
                password: password.trim()
            });

            if (response.data) {
                const data = response.data;
                const displayName = data.full_name || data.email || 'User';
                
                setUserName(displayName);
                updateProfile({
                    name: displayName,
                    email: data.email || email.trim().toLowerCase(),
                    phone: data.phone_number || '',
                    userId: data.user_id?.toString() || null
                });
                
                navigate('/');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            
            const serverError = err.response?.data?.error || err.response?.data?.message;
            const statusText = err.response?.status ? `(Status: ${err.response.status})` : '';
            
            let errorMessage = serverError 
                ? `${serverError} ${statusText}`
                : (err.response?.status ? `Server Error ${statusText}` : 'Network Error: Backend unreachable or CORS blocked.');
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 bg-white min-h-screen flex flex-col pt-4">
            {/* Header / Back button */}
            <div className="px-4 py-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="flex flex-col px-6 md:w-full max-w-7xl md:mx-auto w-full flex-1">
                {/* Top Logos Row - Exactly matching HomePlanner Design */}
                <div className="w-full flex justify-between items-center py-6">
                    <img src={simatsLogo} alt="Simats Logo" className="w-20 h-20 object-contain" />
                    <img src={interfaceLogo} alt="Interface Logo" className="w-24 h-24 object-contain" />
                    <img src={simatsImage} alt="Simats" className="w-20 h-20 object-contain" />
                </div>

                <div className="mt-4 mb-8">
                    <h1 className="text-4xl font-black text-[#001A3F] mb-3 tracking-tight">Welcome Back!</h1>
                    <p className="text-gray-500 text-[17px] leading-relaxed max-w-sm">Log in to access your saved budgets and project intelligence.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    {/* Email Field */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-[#001A3F] mb-2 px-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-[#001A3F] mb-2 px-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-12 pr-12 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="button" 
                            onClick={() => navigate('/forgot-password')}
                            className="text-[14px] font-bold text-[#2962FF] hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-[60px] rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex justify-center items-center gap-3 active:scale-[0.98] ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#2962FF] hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={26} /> : 'Log In'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[15px] font-medium text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-black text-[#2962FF] hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>

                <div className="mt-auto py-10 text-center">
                    <p className="text-[13px] font-bold text-gray-400 tracking-wide uppercase">
                        2026 © Powered by SIMATS Engineering
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
