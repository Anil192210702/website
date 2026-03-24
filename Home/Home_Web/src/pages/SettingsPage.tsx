import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Info, 
  ChevronRight, 
  LogOut,
  HelpCircle,
  Layers
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { constructionApi } from '../services/api';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, logout } = useProject();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SettingsItem = ({ 
        icon: Icon, 
        title, 
        onClick 
    }: { 
        icon: any; 
        title: string; 
        onClick?: () => void 
    }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
        >
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Icon size={18} />
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{title}</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
        </button>
    );

    return (
        <div className="flex-1 bg-white min-h-screen">
            <div className="max-w-xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

                {/* Profile Card */}
                <div 
                    onClick={() => navigate('/profile_account')}
                    className="w-full rounded-[24px] bg-gradient-to-r from-[#00E5BC] to-[#2563EB] p-6 mb-8 shadow-lg cursor-pointer transform transition-transform active:scale-[0.98]"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                            {state.profileImage ? (
                                <img 
                                    src={state.profileImage} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="text-white" size={32} />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-white">{state.userName || 'User'}</h2>
                            <p className="text-sm text-white/80">{state.userEmail || 'No email provided'}</p>
                            {state.userPhone && (
                                <p className="text-xs text-white/80 mt-0.5">{state.userPhone}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Section */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-500 mb-3 px-1">Account</h3>
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <SettingsItem 
                            icon={User} 
                            title="Profile & Account" 
                            onClick={() => navigate('/profile_account')} 
                        />
                        <div className="mx-5 h-px bg-slate-100" />
                        <SettingsItem 
                            icon={Lock} 
                            title="Privacy & Security" 
                            onClick={() => navigate('/privacy_security')} 
                        />
                    </div>
                </div>

                {/* Support Section */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-500 mb-3 px-1">Support</h3>
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <SettingsItem 
                            icon={HelpCircle} 
                            title="Help & Support" 
                            onClick={() => navigate('/help_support')} 
                        />
                        <div className="mx-5 h-px bg-slate-100" />
                        <SettingsItem 
                            icon={Info} 
                            title="About App" 
                            onClick={() => navigate('/about_app')} 
                        />
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:bg-red-50 transition-colors group"
                >
                    <LogOut size={20} className="text-red-500" />
                    <span className="text-base font-bold text-red-500">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
