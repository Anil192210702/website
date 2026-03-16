import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  PlayCircle, 
  ChevronRight, 
  ChevronDown
} from 'lucide-react';

const HelpSupportPage: React.FC = () => {
    const navigate = useNavigate();

    const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="border-b border-slate-50 last:border-0">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between py-5 text-left"
                >
                    <span className="text-[14px] font-bold text-slate-900 pr-4">{question}</span>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                        <ChevronRight size={18} className="text-slate-400" />
                    </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                    <p className="text-sm text-slate-500 leading-relaxed">{answer}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 bg-white min-h-screen">
            {/* Custom Header with Back Button Overlay */}
            <div className="relative h-16 flex items-center justify-center border-b border-slate-100">
                <button onClick={() => navigate(-1)} className="absolute left-4 p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-slate-900">Help & Support</h1>
            </div>

            <div className="max-w-xl mx-auto px-6 py-8">
                {/* Need Help Banner */}
                <div className="w-full rounded-[32px] bg-gradient-to-r from-[#00E5BC] to-[#2D76FA] p-8 mb-10 shadow-xl shadow-blue-100">
                    <h2 className="text-2xl font-bold text-white mb-2">Need Help ?</h2>
                    <p className="text-white/90 text-sm leading-relaxed max-w-[200px]">
                        Our team is here to help you build better.
                    </p>
                </div>

                {/* Support Options */}
                <h3 className="text-base font-bold text-slate-900 mb-4 px-1">Support Options</h3>
                <div className="bg-white rounded-3xl p-2 shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100 mb-10">
                    <a 
                        href="mailto:anilkumar.badithala22@gmail.com"
                        className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Mail size={20} />
                            </div>
                            <span className="text-[15px] font-semibold text-slate-900">Email Support</span>
                        </div>
                        <ChevronRight size={20} className="text-slate-300" />
                    </a>
                    <div className="mx-4 h-px bg-slate-50" />
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <PlayCircle size={20} />
                            </div>
                            <span className="text-[15px] font-semibold text-slate-900">Video Tutorials</span>
                        </div>
                        <ChevronRight size={20} className="text-slate-300" />
                    </button>
                </div>

                {/* FAQ Section */}
                <h3 className="text-base font-bold text-slate-900 mb-4 px-1">Frequently Asked Questions</h3>
                <div className="bg-white rounded-3xl px-6 py-2 shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100">
                    <FaqItem 
                        question="How to start a new project?" 
                        answer="On the Home screen, click on 'Construction Budget' or 'Interior Budget' to begin a new estimation flow for your project."
                    />
                    <FaqItem 
                        question="How does AI estimation work?" 
                        answer="Our AI combines current market rates for materials and labor based on your location and specific project requirements to provide highly accurate cost estimates."
                    />
                    <FaqItem 
                        question="Exporting budget reports" 
                        answer="After completing an estimation, you can find the project in the 'My Projects' screen. You can then view or export the detailed breakdown."
                    />
                    <FaqItem 
                        question="Material price updates" 
                        answer="We update our database monthly to reflect the latest market fluctuations in construction and interior material prices across different cities."
                    />
                </div>
            </div>
        </div>
    );
};

export default HelpSupportPage;
