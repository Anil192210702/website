import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowLeft, Grid, AppWindow, PaintRoller, Loader2 } from 'lucide-react';

const mockSuggestions = [
    { id: 'tiles', title: 'Elite Flooring Swap', savings: 97500, desc: 'Use Premium GVT tiles (₹150/sqft) in bedrooms instead of Italian marble (₹800/sqft).', icon: Grid },
    { id: 'windows', title: 'Window Frame Optimization', savings: 9000, desc: 'Using UPVC instead of hardwood frames.', icon: AppWindow },
    { id: 'paint', title: 'Paint Application Optimization', savings: 7000, desc: 'Optimized base layer coating strategy.', icon: PaintRoller }
];

const OptimizationResultsPage = () => {
    const navigate = useNavigate();
    const { updateConstruction } = useProject();
    const { packageType } = useParams<{ packageType: string }>();
    const pkg = (packageType || 'basic');
    const displayPkg = pkg.charAt(0).toUpperCase() + pkg.slice(1);

    const [selectedIds, setSelectedIds] = useState<string[]>(mockSuggestions.map(s => s.id));
    const [isApplying, setIsApplying] = useState(false);

    const currentTotalSavings = mockSuggestions
        .filter(s => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + s.savings, 0);

    const toggleSuggestion = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleApply = () => {
        setIsApplying(true);
        setTimeout(() => {
            updateConstruction({ optimizationSavings: currentTotalSavings });
            navigate(`/construction/cost-estimate/${pkg}`);
        }, 800);
    };

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-black" />
                </button>
                <h1 className="text-lg font-bold text-[#001A3F]">{displayPkg} Budget Optimizer</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            <div className="px-6 flex-1 overflow-y-auto pb-28 hide-scrollbar flex flex-col items-center">
                <div className="mt-6 mb-2">
                    <span className="text-gray-500 text-sm">AI Identified Cost Optimization</span>
                </div>

                <h2 className="text-5xl font-black text-[#001A3F] mb-2 tracking-tight">
                    ₹{currentTotalSavings.toLocaleString('en-IN')}
                </h2>

                <div className="text-gray-500 text-sm mb-8 text-center px-4">
                    can be optimized in your current {displayPkg} plan
                </div>

                <div className="space-y-4 w-full">
                    {mockSuggestions.map(suggestion => (
                        <div key={suggestion.id} className="border border-gray-200 rounded-2xl p-4 bg-white">
                            <div className="flex items-center w-full mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <suggestion.icon size={20} className="text-blue-600" />
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className="font-bold text-[#001A3F] leading-tight">{suggestion.title}</h3>
                                </div>
                                <div className="ml-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={selectedIds.includes(suggestion.id)}
                                            onChange={() => toggleSuggestion(suggestion.id)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2ECC71]"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white border rounded-lg p-3 text-sm text-gray-500 mb-3 leading-relaxed">
                                {suggestion.desc}
                            </div>

                            <div className="bg-[#E8F8F0] text-[#27AE60] text-xs font-bold px-3 py-1.5 rounded-lg inline-block">
                                Save ₹{suggestion.savings.toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-white absolute bottom-0 left-0 right-0">
                <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="w-full bg-[#1B3B8A] text-white h-14 rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-80"
                >
                    {isApplying ? <Loader2 size={24} className="animate-spin text-white" /> : "Apply All Optimizations"}
                </button>
            </div>
        </div>
    );
};

export default OptimizationResultsPage;
