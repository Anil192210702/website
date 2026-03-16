import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { authApi } from '../services/api';

// Logo Imports
import simatsLogo from '../assets/simats_logo.jpeg';
import interfaceLogo from '../assets/interface_logo.jpeg';
import simatsImage from '../assets/simats.jpeg';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { setUserName } = useProject();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
            setError('Please fill all fields');
            return;
        }
        if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
            setError('Only @gmail.com email addresses are accepted');
            return;
        }
        if (phoneNumber.length !== 10) {
            setError('Phone number must be 10 digits');
            return;
        }
        if (!['6', '7', '8', '9'].includes(phoneNumber[0])) {
            setError('Phone number must start with 6, 7, 8, or 9');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one capital letter');
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError('Password must contain at least one number');
            return;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            setError('Password must contain at least one special character');
            return;
        }
        if (!isAgreed) {
            setError('Please agree to the Terms & Conditions');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.register({
                username: email.trim().toLowerCase(),
                email: email.trim().toLowerCase(),
                password: password,
                full_name: fullName.trim(),
                phone_number: phoneNumber
            });

            if (response.status === 201 || response.status === 200) {
                navigate('/login');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Registration failed';
            setError(errorMsg);
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
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 font-bold"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="flex flex-col px-6 md:w-full max-w-7xl md:mx-auto w-full flex-1">
                {/* Top Logos Row - Exactly matching HomePlanner Design */}
                <div className="w-full flex justify-between items-center py-4">
                    <img src={simatsLogo} alt="Simats Logo" className="w-16 h-16 object-contain" />
                    <img src={interfaceLogo} alt="Interface Logo" className="w-20 h-20 object-contain" />
                    <img src={simatsImage} alt="Simats" className="w-16 h-16 object-contain" />
                </div>

                <div className="mt-2 mb-8">
                    <h1 className="text-4xl font-black text-[#001A3F] mb-3 tracking-tight">Create Account</h1>
                    <p className="text-gray-500 text-[17px] leading-relaxed max-w-sm">Sign up to track every rupee of your build.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    {/* Full Name Field */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-[#001A3F] mb-2 px-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>

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
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Phone Number Field */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-[#001A3F] mb-2 px-1">Phone Number</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const input = e.target.value.replace(/[^0-9]/g, '');
                                    if (input.length <= 10) setPhoneNumber(input);
                                }}
                                placeholder="10-digit mobile number"
                                className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
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
                                placeholder="Create a strong password"
                                className="w-full pl-12 pr-12 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
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

                    {/* Checkbox */}
                    <div className="flex items-center gap-3 mt-2 px-1">
                        <input
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E2E8F0] text-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer"
                        />
                        <span className="text-[15px] font-medium text-gray-500">
                            I agree to the <span className="text-[#2962FF] font-bold cursor-pointer hover:underline">Terms & Conditions</span>
                        </span>
                    </div>

                    <div className="mt-8 mb-6 pb-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-[60px] rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex justify-center items-center gap-3 active:scale-[0.98] ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#2962FF] hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={26} /> : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="text-center py-4">
                    <p className="text-[15px] font-medium text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black text-[#2962FF] hover:underline">
                            Log In
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

export default RegisterPage;
