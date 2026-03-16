import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';

// Logo Imports
import simatsLogo from '../assets/simats_logo.jpeg';
import interfaceLogo from '../assets/interface_logo.jpeg';
import simatsImage from '../assets/simats.jpeg';

const OtpVerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Redirect if no email in state
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');

        const otpCode = otp.join('');
        if (otpCode.length < 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.verifyOtp({
                email,
                otp_code: otpCode
            });

            if (response.status === 200) {
                navigate('/reset-password', { state: { email, otp: otpCode } });
            }
        } catch (err: any) {
            console.error('Verify OTP error:', err);
            const errorMsg = err.response?.data?.error || 'Invalid OTP code';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setIsLoading(true);
        try {
            await authApi.requestOtp({ email });
            alert('OTP Resent Successfully');
        } catch (err: any) {
            setError('Failed to resend OTP');
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

            <div className="flex flex-col px-6 md:w-full max-w-7xl md:mx-auto w-full flex-1 items-center">
                {/* Top Logos Row - Exactly matching HomePlanner Design */}
                <div className="w-full flex justify-between items-center py-6 max-w-md">
                    <img src={simatsLogo} alt="Simats Logo" className="w-16 h-16 object-contain" />
                    <img src={interfaceLogo} alt="Interface Logo" className="w-20 h-20 object-contain" />
                    <img src={simatsImage} alt="Simats" className="w-16 h-16 object-contain" />
                </div>

                <div className="mt-4 mb-10 flex flex-col items-center text-center">
                    {/* Shield Icon in Blue Circle - Matching HomePlanner Design */}
                    <div className="w-20 h-20 bg-[#F2F6FF] rounded-full flex items-center justify-center mb-6">
                        <Shield size={36} className="text-[#2962FF]" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-[#001A3F] mb-3 tracking-tight">OTP Verification</h1>
                    <p className="text-gray-500 text-[16px] max-w-xs leading-relaxed font-medium">
                        Enter the 6-digit code sent to your<br />
                        <span className="font-bold text-[#2962FF]">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="w-full max-w-md mb-8 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                        {error}
                    </div>
                )}

                <div className="w-full max-w-sm">
                    <div className="flex justify-between gap-2 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                ref={(el) => { inputRefs.current[index] = el; }}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-black border border-[#E2E8F0] rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-[#F8FAFC] focus:bg-white transition-all text-[#1E293B]"
                            />
                        ))}
                    </div>

                    <div className="flex justify-center mb-10">
                        <p className="text-[15px] font-medium text-gray-400">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="font-black text-[#2962FF] hover:underline"
                            >
                                Resend OTP
                            </button>
                        </p>
                    </div>

                    <button
                        onClick={() => handleVerifyOtp()}
                        disabled={isLoading}
                        className={`w-full h-[60px] rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex justify-center items-center gap-3 active:scale-[0.98] ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#2962FF] hover:bg-blue-700 text-white'
                        }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={26} /> : 'Verify OTP'}
                    </button>
                    
                    <div className="mt-auto py-12 text-center">
                        <p className="text-[13px] font-bold text-gray-400 tracking-wide uppercase">
                            2026 © Powered by SIMATS Engineering
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationPage;
