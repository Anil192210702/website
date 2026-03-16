import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home,
  CheckCircle,
  ShieldCheck,
  Instagram,
  Linkedin,
  Rocket,
  ArrowRight,
  X,
  Smartphone,
  User,
  Eye,
  Lock,
  Database,
  RefreshCcw,
  ExternalLink
} from 'lucide-react';

const PolicyModal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {children}
                </div>
                <div className="p-6 bg-slate-50 flex justify-center">
                    <button 
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const AboutAppPage: React.FC = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState<'terms' | 'privacy' | null>(null);

    const FeatureItem = ({ icon: Icon, title, subtitle }: any) => (
        <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[13px] font-bold text-slate-900">{title}</p>
                <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
            </div>
        </div>
    );

    const PolicyItem = ({ icon: Icon, title, description }: any) => (
        <div className="flex gap-4 mb-6 last:mb-0">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={18} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-white min-h-screen">
            {/* Header */}
            <div className="h-16 flex items-center justify-center border-b border-slate-100 sticky top-0 bg-white z-10">
                <button onClick={() => navigate(-1)} className="absolute left-4 p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-slate-900">About</h1>
            </div>

            <div className="max-w-xl mx-auto px-6 py-8">
                {/* Hero Card */}
                <div className="w-full rounded-[32px] bg-gradient-to-b from-[#00E5BC] to-[#2D76FA] p-10 mb-8 flex flex-col items-center text-center shadow-xl shadow-blue-50">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                        <Home size={28} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">HomeBuild Planner</h2>
                    <p className="text-white/80 text-[11px] leading-tight max-w-[180px]">
                        AI-Based Construction & Interior Budget Estimation
                    </p>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 mb-6">
                    <h3 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mb-4">About App</h3>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                        HomePlanner leverages advanced AI to provide real-time cost estimation and budget tracking for your dream construction projects. Our intelligent algorithms analyze market rates to give you precise financial insights before you build.
                    </p>
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 mb-6">
                    <h3 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mb-4">Key Features</h3>
                    <FeatureItem icon={Rocket} title="AI Cost Prediction" subtitle="Accurate forecasts powered by ML" />
                    <FeatureItem icon={CheckCircle} title="Smart Material Swap" subtitle="Compare alternatives instantly" />
                    <FeatureItem icon={ShieldCheck} title="Budget Tracking" subtitle="Real-time expense monitoring" />
                </div>

                {/* Legal Section */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 mb-6">
                    <h3 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mb-4">Legal</h3>
                    <button 
                        onClick={() => setModal('terms')}
                        className="w-full flex items-center justify-between py-3 text-slate-700 hover:text-blue-600 text-sm font-bold transition-colors group"
                    >
                        Terms of Service 
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </button>
                    <div className="h-px bg-slate-50 w-full"></div>
                    <button 
                        onClick={() => setModal('privacy')}
                        className="w-full flex items-center justify-between py-3 text-slate-700 hover:text-blue-600 text-sm font-bold transition-colors group"
                    >
                        Privacy Policy 
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </button>
                </div>

                {/* Social Section */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 mb-10 flex flex-col items-center">
                    <h3 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mb-6">Follow Us</h3>
                    <div className="flex gap-10">
                        <div className="flex flex-col items-center gap-2">
                            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95">
                                <Linkedin size={22} />
                            </button>
                            <span className="text-[10px] font-bold text-slate-400">LinkedIn</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-all active:scale-95">
                                <Instagram size={22} />
                            </button>
                            <span className="text-[10px] font-bold text-slate-400">Instagram</span>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[11px] text-slate-400 font-medium mb-8">
                    © 2026 HomeBuild Planner. All rights reserved.
                </p>
            </div>

            {/* Terms of Service Modal */}
            <PolicyModal 
                isOpen={modal === 'terms'} 
                onClose={() => setModal(null)} 
                title="Terms of Service"
            >
                <h3 className="text-lg font-extrabold text-blue-600 mb-3">Welcome to HomeBuild Planner</h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    HomeBuild Planner is your AI-driven companion for construction and interior budget estimation. By using our app, you agree to the following terms which ensure a safe and reliable planning experience for your dream home.
                </p>
                <div className="space-y-6">
                    <PolicyItem 
                        icon={Smartphone} 
                        title="1. Use of the App" 
                        description="The app is intended for personal, non-commercial use in planning residential projects. Access may be restricted for maintenance or updates." 
                    />
                    <PolicyItem 
                        icon={User} 
                        title="2. User Responsibilities" 
                        description="You are responsible for the accuracy of the data you input. Misuse of the platform or attempting to bypass security features is prohibited." 
                    />
                    <PolicyItem 
                        icon={ShieldCheck} 
                        title="3. Data Privacy" 
                        description="Your data is handled according to our Privacy Policy. We use AI to process your inputs locally and securely to provide estimations." 
                    />
                </div>
            </PolicyModal>

            {/* Privacy Policy Modal */}
            <PolicyModal 
                isOpen={modal === 'privacy'} 
                onClose={() => setModal(null)} 
                title="Privacy Policy"
            >
                <div className="space-y-6">
                    <PolicyItem 
                        icon={Database} 
                        title="Information We Collect" 
                        description="We collect basic profile details and project-specific data to provide accurate estimations." 
                    />
                    <PolicyItem 
                        icon={RefreshCcw} 
                        title="How We Use Your Information" 
                        description="Data is used to calibrate AI models and improve regional cost accuracy." 
                    />
                    <PolicyItem 
                        icon={Lock} 
                        title="Data Security" 
                        description="All communications are encrypted using enterprise-grade protocols." 
                    />
                    <PolicyItem 
                        icon={ShieldCheck} 
                        title="Data Storage & Protection" 
                        description="Your project reports are stored securely in the cloud with multi-layer protection." 
                    />
                    <PolicyItem 
                        icon={User} 
                        title="User Rights & Account Control" 
                        description="You have full control to view, export, or delete your data at any time." 
                    />
                    <PolicyItem 
                        icon={ExternalLink} 
                        title="Third-Party Services" 
                        description="We do not sell your personal data to third parties." 
                    />
                    <PolicyItem 
                        icon={RefreshCcw} 
                        title="Policy Updates" 
                        description="We notify users of any significant changes to our data handling practices." 
                    />
                </div>
            </PolicyModal>
        </div>
    );
};

export default AboutAppPage;
