import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowLeft, Check } from 'lucide-react';

const InteriorPackagePage = () => {
    const navigate = useNavigate();
    const { state, updateInterior } = useProject();

    // Default to Premium, like the Android app did
    const [selectedPackage, setSelectedPackage] = useState(state.interior.packageType || 'Premium');

    const handleContinue = () => {
        updateInterior({ packageType: selectedPackage });
        navigate(`/interior/selection/${selectedPackage}`);
    };

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative px-6">
            <div className="flex items-center py-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 flex items-center gap-2">
                    <ArrowLeft size={24} className="text-gray-500" />
                    <span className="text-gray-500 text-base">Back</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
                <h1 className="text-[28px] leading-tight font-bold text-[#001A3F]">
                    Select Interior Package
                </h1>

                <p className="text-gray-500 text-base mt-2 mb-6">
                    Choose the interior package that<br />fits your needs
                </p>

                {/* Basic Package */}
                <PackageCard
                    title="Basic"
                    subtitle="Essential Interior solutions"
                    features={[
                        "Standard materials",
                        "Basic finishes",
                        "Essential fixtures",
                        "Simple designs"
                    ]}
                    isSelected={selectedPackage === 'Basic'}
                    onClick={() => setSelectedPackage('Basic')}
                />

                <div className="h-4"></div>

                {/* Premium Package */}
                <PackageCard
                    title="Premium"
                    subtitle="Enhanced quality and style"
                    features={[
                        "Premium materials",
                        "Quality finishes",
                        "Designer fixtures",
                        "Modern designs",
                        "Custom options"
                    ]}
                    isSelected={selectedPackage === 'Premium'}
                    isMostPopular
                    onClick={() => setSelectedPackage('Premium')}
                />

                <div className="h-4"></div>

                {/* Luxury Package */}
                <PackageCard
                    title="Luxury"
                    subtitle="High-end luxury interiors"
                    features={[
                        "Luxury materials",
                        "Premium finishes",
                        "Designer brands",
                        "Bespoke designs",
                        "Full customization",
                        "Premium support"
                    ]}
                    isSelected={selectedPackage === 'Luxury'}
                    onClick={() => setSelectedPackage('Luxury')}
                />
            </div>

            <div className="pb-8 bg-white pt-4">
                <button
                    onClick={handleContinue}
                    className="w-full h-14 rounded-xl font-bold text-base flex items-center justify-center transition-all bg-[#0D9488] text-white hover:bg-teal-700"
                >
                    Continue to Room Selection
                </button>
            </div>
        </div>
    );
};

const PackageCard = ({
    title,
    subtitle,
    features,
    isSelected,
    isMostPopular = false,
    onClick
}: {
    title: string;
    subtitle: string;
    features: string[];
    isSelected: boolean;
    isMostPopular?: boolean;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={`w-full rounded-2xl bg-white cursor-pointer transition-all ${isSelected ? 'border-2 border-[#14B8A6] shadow-md' : 'border border-gray-100 shadow-sm'
                }`}
        >
            <div className="p-5">
                {isMostPopular && (
                    <div className="bg-[#CCFBF1] rounded-xl inline-block mb-3">
                        <span className="text-[#0D9488] text-[10px] font-bold px-3 py-1 block">
                            Most Popular
                        </span>
                    </div>
                )}

                <h2 className="text-xl font-bold text-black">{title}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">{subtitle}</p>

                <div className="space-y-2">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <Check size={18} className="text-[#0D9488]" />
                            <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InteriorPackagePage;
