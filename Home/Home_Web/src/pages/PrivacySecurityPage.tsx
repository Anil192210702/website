import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const PrivacySecurityPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useProject();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteAccount = () => {
        // In a real app, this would call an API
        logout();
        navigate('/');
    };

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors mb-4">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Privacy & Security</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your account & app preferences</p>
            </div>

            <div className="max-w-xl mx-auto px-6 py-8">
                {/* Account Security Label */}
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Account Security</h3>
                
                <p className="text-sm text-slate-500 bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-8">
                    Security features like Biometric Login are currently only available on our mobile application.
                </p>

                {/* Danger Zone */}
                <h3 className="text-xs font-bold text-red-500 uppercase tracking-[0.1em] mb-4">Danger Zone</h3>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-red-50 transition-colors group"
                >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 group-hover:bg-red-100">
                        <Trash2 size={20} />
                    </div>
                    <span className="text-base font-semibold text-red-600">Delete Account</span>
                </button>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Account</h2>
                        <p className="text-slate-500 text-center mb-8 leading-relaxed">
                            Are you sure you want to delete your account? This action cannot be undone and all your project data will be permanently removed.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors"
                            >
                                Delete Anyway
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacySecurityPage;
