import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowLeft, Layers, Gem, Crown, CheckCircle2 } from 'lucide-react';

const ConstructionPackagePage = () => {
    const navigate = useNavigate();
    const { state, updateConstruction } = useProject();
    const selectedPkg = state.construction.packageType;

    const handleSelect = (pkg: string) => {
        updateConstruction({ packageType: pkg });
    };

    const handleNext = () => {
        const routeEnum = selectedPkg.toLowerCase();
        navigate(`/construction/selection/${routeEnum}`);
    };

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative">
            <div className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
            </div>

            <div className="px-6 flex-1 overflow-y-auto pb-24 hide-scrollbar">
                <h1 className="text-3xl font-bold text-[#001A3F]">Select Construction Package</h1>
                <p className="text-gray-500 mt-2 mb-8">Choose the quality level for your home.</p>

                <div className="space-y-4">
                    {[
                        { id: 'Basic', icon: Layers, desc: 'Essential materials & standard finishes' },
                        { id: 'Premium', icon: Gem, desc: 'Best value with modern designs' },
                        { id: 'Luxury', icon: Crown, desc: 'Top-tier specifications & finish' }
                    ].map(p => {
                        const isSelected = selectedPkg === p.id;
                        return (
                            <div
                                key={p.id}
                                onClick={() => handleSelect(p.id)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${isSelected ? 'border-blue-500 border-2' : 'border-gray-200 bg-white hover:border-blue-200'
                                    }`}
                            >
                                <div className={`p-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <p.icon size={28} />
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-black'}`}>
                                        {p.id}
                                    </h3>
                                    <p className={`text-sm ${isSelected ? 'text-blue-600/70' : 'text-gray-500'}`}>
                                        {p.desc}
                                    </p>
                                </div>

                                {isSelected && (
                                    <CheckCircle2 size={24} className="text-blue-600" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 bg-white absolute bottom-0 left-0 right-0">
                <button
                    onClick={handleNext}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ConstructionPackagePage;
