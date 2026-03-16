import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, X } from 'lucide-react';

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLoginClick = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <LogIn size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h3>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        Please log in to your account to proceed with estimates and calculations.
                    </p>

                    <button
                        onClick={handleLoginClick}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                        Log In Now
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full mt-3 text-gray-500 hover:text-gray-700 font-medium py-2 text-sm transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPromptModal;
