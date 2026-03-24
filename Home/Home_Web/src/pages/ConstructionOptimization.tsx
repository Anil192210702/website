import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

const optimizations = [
    { id: 'tiles', title: 'Elite Flooring Swap', savings: 97500, desc: 'Use Premium GVT tiles (₹150/sqft) in bedrooms instead of Italian marble (₹800/sqft).' },
    { id: 'windows', title: 'Window Frame Optimization', savings: 9000, desc: 'Using UPVC instead of hardwood frames.' },
    { id: 'paint', title: 'Paint Application Optimization', savings: 7000, desc: 'Optimized base layer coating strategy.' }
];

const ConstructionOptimization = () => {
    const { updateConstruction } = useProject();
    const navigate = useNavigate();
    const [selected, setSelected] = useState<string[]>(['tiles', 'windows', 'paint']);

    const toggleOpt = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const totalSavings = selected.reduce((sum, id) => {
        const opt = optimizations.find(o => o.id === id);
        return sum + (opt ? opt.savings : 0);
    }, 0);

    const handleApply = () => {
        updateConstruction({ optimizationSavings: totalSavings });
        navigate('/construction/cost-estimate');
    };

    return (
        <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                    <Sparkles size={28} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">AI Identified Cost Optimization</h2>
                <p className="text-sm text-gray-500 mt-1">Based on your selections, we found intelligent ways to save money without compromising integrity.</p>
            </div>

            <div className="bg-indigo-600 text-white rounded-2xl p-6 text-center shadow-lg mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
                <p className="text-xs text-indigo-200 uppercase tracking-wider mb-1 font-semibold">Total Potential Savings</p>
                <h3 className="text-4xl font-bold">₹ {totalSavings.toLocaleString('en-IN')}</h3>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto hide-scrollbar pb-6">
                {optimizations.map(opt => (
                    <div
                        key={opt.id}
                        onClick={() => toggleOpt(opt.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${selected.includes(opt.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                    >
                        <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${selected.includes(opt.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300'}`}>
                            {selected.includes(opt.id) && <Check size={16} />}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 text-sm">{opt.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                            <p className="text-sm font-bold text-indigo-700 mt-2">Save ₹{opt.savings.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 bg-gray-50 -mx-4 px-4 pb-safe space-y-3">
                <button
                    onClick={handleApply}
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-medium shadow-[0_4px_14px_rgba(79,70,229,0.39)] hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                    Apply Optimizations <ArrowRight size={18} />
                </button>
                <button
                    onClick={() => navigate('/construction/cost-estimate')}
                    className="w-full text-gray-500 py-3 rounded-xl font-medium text-sm hover:bg-gray-100 transition"
                >
                    Skip Optimizations
                </button>
            </div>
        </div>
    );
};

export default ConstructionOptimization;
