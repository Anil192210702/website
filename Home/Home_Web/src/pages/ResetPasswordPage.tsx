import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';

// Logo Imports
import simatsLogo from '../assets/simats_logo.jpeg';
import interfaceLogo from '../assets/interface_logo.jpeg';
import simatsImage from '../assets/simats.jpeg';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Redirect if no email or otp in state
        if (!email || !otp) {
            navigate('/forgot-password');
        }
    }, [email, otp, navigate]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!newPassword || !confirmPassword) {
            setError('Please fill all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Add password complexity validation
        if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
            setError('Password must contain at least one capital letter, one number, and one special character');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.resetPassword({
                email,
                otp_code: otp,
                new_password: newPassword,
                confirm_password: confirmPassword
            });

            if (response.status === 200) {
                setMessage('Password updated successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err: any) {
            console.error('Reset Password error:', err);
            const errorMsg = err.response?.data?.error || 'Failed to update password';
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

            <div className="flex flex-col px-6 md:w-full max-w-7xl md:mx-auto w-full flex-1 items-center pb-12">
                {/* Top Logos Row - Exactly matching HomePlanner Design */}
                <div className="w-full flex justify-between items-center py-6 max-w-md">
                    <img src={simatsLogo} alt="Simats Logo" className="w-16 h-16 object-contain" />
                    <img src={interfaceLogo} alt="Interface Logo" className="w-20 h-20 object-contain" />
                    <img src={simatsImage} alt="Simats" className="w-16 h-16 object-contain" />
                </div>

                <div className="mt-4 mb-10 flex flex-col items-center text-center">
                    {/* Lock Icon in Blue Circle - Matching HomePlanner Design */}
                    <div className="w-20 h-20 bg-[#F2F6FF] rounded-full flex items-center justify-center mb-6">
                        <Lock size={36} className="text-[#2962FF]" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-[#001A3F] mb-3 tracking-tight">Reset Password</h1>
                    <p className="text-gray-500 text-[16px] leading-relaxed max-w-xs font-medium">
                        Create a new strong password for<br />
                        <span className="font-bold text-[#2962FF]">{email}</span>
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

                <form onSubmit={handleResetPassword} className="w-full max-w-md flex flex-col gap-6">
                    {/* New Password Field */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-[#001A3F] mb-2 px-1">New Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full pl-12 pr-12 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showNewPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-[#001A3F] mb-2 px-1">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="w-full pl-12 pr-12 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-[60px] rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex justify-center items-center gap-3 active:scale-[0.98] ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#2962FF] hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={26} /> : 'Update Password'}
                        </button>
                    </div>
                </form>

                <div className="mt-auto py-12 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="font-black text-[#2962FF] hover:underline transition-colors mb-10"
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

export default ResetPasswordPage;
