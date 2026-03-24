import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';
import { validateEmail } from '../utils/validation';

// Logo Imports
import simatsLogo from '../assets/simats_logo.jpeg';
import interfaceLogo from '../assets/interface_logo.jpeg';
import simatsImage from '../assets/simats.jpeg';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address (must contain @ and end with .com)');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.requestOtp({
                email: email.trim().toLowerCase()
            });

            if (response.status === 200 || response.status === 201) {
                setMessage('OTP sent to your email');
                // Pass email to verify otp page
                setTimeout(() => {
                    navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } });
                }, 1500);
            }
        } catch (err: any) {
            console.error('Request OTP error:', err);
            let errorMsg = 'Failed to send OTP';
            
            if (err.response) {
                // Server returned an error response
                errorMsg = err.response.data?.error || `Server Error (${err.response.status})`;
                if (err.response.status === 500) {
                    errorMsg = "Server failed to send email. Please check backend Gmail settings.";
                }
            } else if (err.request) {
                // Request was made but no response received
                errorMsg = 'Network error. Please check if your backend is running.';
            }
            
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
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="flex flex-col px-6 md:w-full max-w-7xl md:mx-auto w-full flex-1 items-center pb-8">
                {/* Top Logos Row - Exactly matching HomePlanner Design */}
                <div className="w-full flex justify-between items-center py-6 max-w-md">
                    <img src={simatsLogo} alt="Simats Logo" className="w-16 h-16 object-contain" />
                    <img src={interfaceLogo} alt="Interface Logo" className="w-20 h-20 object-contain" />
                    <img src={simatsImage} alt="Simats" className="w-16 h-16 object-contain" />
                </div>

                <div className="mt-4 mb-8 flex flex-col items-center text-center">
                    {/* Lock Icon in Blue Circle - Matching HomePlanner Design */}
                    <div className="w-20 h-20 bg-[#F2F6FF] rounded-full flex items-center justify-center mb-6">
                        <Lock size={32} className="text-[#2962FF]" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-[#001A3F] mb-3 tracking-tight">Forgot Password</h1>
                    <p className="text-gray-500 text-[16px] leading-relaxed max-w-sm">
                        Enter your registered email to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="w-full max-w-md mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                        {error}
                    </div>
                )}

                {message && (
                    <div className="w-full max-w-md mb-6 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-semibold border border-green-100 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full shrink-0" />
                        {message}
                    </div>
                )}

                <form onSubmit={handleSendOtp} className="w-full max-w-md flex flex-col gap-6">
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

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-[60px] rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex justify-center items-center gap-3 active:scale-[0.98] ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#2962FF] hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={26} /> : 'Send OTP'}
                        </button>
                    </div>
                </form>

                <div className="mt-auto py-8 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="font-black text-[#2962FF] hover:underline transition-colors mb-8"
                    >
                        Back to Login
                    </button>
                    <p className="text-[13px] font-bold text-gray-400 tracking-wide uppercase">
                        2026 © Powered by SIMATS Engineering
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
