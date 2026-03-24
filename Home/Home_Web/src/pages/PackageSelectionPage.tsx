import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Waves, BrickWall, Hammer, Grip, DoorOpen, LayoutGrid, Plug, PaintRoller, Layers, Grid, Shield, PaintBucket, Wrench, ArrowLeft } from 'lucide-react';

import cementImg from '../assets/interior/cement.jpg';
import sandImg from '../assets/interior/sand.jpg';
import bricksImg from '../assets/interior/bricks.jpg';
import ironImg from '../assets/interior/iron.jpg';
import aggregateImg from '../assets/interior/aggregates.webp';
import windowImg from '../assets/interior/windows.jpg';
import tilesImg from '../assets/interior/tiles.jpg';
import electricalImg from '../assets/interior/electrical.jpg';
import paintingImg from '../assets/interior/painting.png';
const materialData: Record<string, any[]> = {
    'basic': [
        { title: 'Cement', spec: 'Regional PPC Brands (Penna, Priya)', icon: Box },
        { title: 'Sand', spec: 'Standard M-Sand', icon: Waves },
        { title: 'Bricks', spec: 'Local Red Bricks or Fly Ash Bricks', icon: BrickWall },
        { title: 'Iron', spec: 'Local ISI-marked TMT (Kamdhenu)', icon: Hammer },
        { title: 'Aggregate', spec: 'Standard 20mm/40mm mix', icon: Grip },
        { title: 'Windows & Doors', spec: 'Aluminum frames, Flush doors', icon: DoorOpen },
        { title: 'Tiles', spec: 'Standard 2x2 Vitrified (Cera/Std)', icon: LayoutGrid },
        { title: 'Electrical', spec: 'Basic Modular (Anchor/Roma)', icon: Plug },
        { title: 'Painting', spec: 'Standard Emulsion (Tractor/Basic)', icon: PaintRoller }
    ],
    'premium': [
        { title: 'Cement', spec: 'Grade 53 OPC', brand: 'UltraTech / ACC', badge: 'MOST POPULAR', icon: Layers },
        { title: 'Sand', spec: 'P-Sand / Filtered', brand: 'River Sand Alt', badge: 'ECO-FRIENDLY', icon: Waves },
        { title: 'Bricks', spec: 'AAC Blocks', brand: 'Magicrete', badge: 'HIGH INSULATION', icon: Grid },
        { title: 'Iron & Steel', spec: 'Fe 550D Grade', brand: 'Tata Tiscon / JSW', badge: 'HIGH STRENGTH', icon: Hammer },
        { title: 'Aggregate', spec: '20mm Crushed', brand: 'Machine Graded', badge: 'CERTIFIED', icon: Layers },
        { title: 'Windows', spec: 'UPVC & Teak', brand: 'Fenesta', badge: 'PREMIUM', icon: LayoutGrid },
        { title: 'Tiles', spec: 'GVT Vitrified', brand: 'Kajaria / Somany', badge: 'LARGE FORMAT', icon: Grid },
        { title: 'Electrical', spec: 'Modular Switches', brand: 'Havells / Legrand', badge: 'SMART READY', icon: Wrench },
        { title: 'Painting', spec: 'Prem. Emulsion', brand: 'Asian Royale / Apex', badge: 'WASHABLE', icon: PaintBucket }
    ],
    'luxury': [
        { title: 'Cement', spec: 'High-Performance Waterproof', brand: 'ULTRATECH', icon: cementImg },
        { title: 'Sand', spec: 'Washed Premium River Sand', brand: 'PREMIUM RIVER', icon: sandImg },
        { title: 'Bricks', spec: 'Acoustic / Wire-Cut', brand: 'WIENERBERGER', icon: bricksImg },
        { title: 'Iron', spec: 'Fe 550D Corrosion-Resistant', brand: 'TATA TISCON', icon: ironImg },
        { title: 'Aggregate', spec: '20mm / 40mm Graded', brand: 'MACHINE GRADED', icon: aggregateImg },
        { title: 'Windows & Doors', spec: 'Thermal-Break & Solid Teak', brand: 'FENESTA', icon: windowImg },
        { title: 'Tiles', spec: 'Italian Marble / Hardwood', brand: 'KAJARIA', icon: tilesImg },
        { title: 'Electrical', spec: 'Smart Home Automation', brand: 'SCHNEIDER', icon: electricalImg },
        { title: 'Painting', spec: 'Designer PU / Velvet', brand: 'ASIAN PAINTS', icon: paintingImg }
    ]
};

const PackageSelectionPage = () => {
    const navigate = useNavigate();
    const { packageType } = useParams<{ packageType: string }>();
    const pkg = (packageType || 'basic').toLowerCase();
    const title = pkg.charAt(0).toUpperCase() + pkg.slice(1);

    const materials = materialData[pkg] || materialData['basic'];
    const isLuxury = pkg === 'luxury';
    const isPremium = pkg === 'premium';

    const handleCalculate = () => {
        navigate(`/construction/cost-estimate/${pkg}`);
    };

    if (isLuxury) {
        return (
            <div className="flex flex-col h-full w-full max-w-7xl mx-auto relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 pointer-events-none"></div>
                <div className="flex items-center p-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10">
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                </div>

                <div className="px-6 flex-1 overflow-y-auto pb-32 hide-scrollbar relative z-10">
                    <h1 className="text-3xl font-black text-white tracking-wide">Luxury Selection</h1>
                    <p className="text-white/60 mt-2 mb-8 font-medium leading-relaxed">
                        Curated premium materials for high-end residential construction.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {materials.map((m, idx) => (
                            <div key={idx} className="relative rounded-3xl h-36 overflow-hidden flex items-center shadow-md bg-white">
                                {/* Background Image with Dark Overlay to make bright text pop */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${m.icon})` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/40"></div>

                                <div className="p-6 relative z-10 flex flex-col justify-center h-full w-full">
                                    <div className="bg-white/20 w-max px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-widest mb-3 backdrop-blur-sm">
                                        {m.brand}
                                    </div>
                                    <h4 className="text-2xl font-black text-white mb-1 drop-shadow-md">{m.title}</h4>
                                    <p className="text-sm font-bold text-gray-100 drop-shadow-md">{m.spec}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 absolute bottom-0 left-0 right-0 z-20">
                    <button
                        onClick={handleCalculate}
                        className="w-full bg-white text-slate-900 py-4 rounded-xl font-extrabold text-lg shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-95 transition-transform"
                    >
                        Calculate Luxury Budget
                    </button>
                </div>
            </div>
        );
    }

    if (isPremium) {
        return (
            <div className="flex flex-col h-full w-full max-w-7xl mx-auto relative bg-[#F8F9FA]">
                <div className="flex items-center p-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200">
                        <ArrowLeft size={24} className="text-black" />
                    </button>
                    <div className="ml-2">
                        <h1 className="text-lg font-bold text-[#001A3F] leading-tight">Premium Selection</h1>
                        <p className="text-xs text-gray-500">Standard Package</p>
                    </div>
                </div>

                <div className="px-4 flex-1 overflow-y-auto pb-24 hide-scrollbar">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {materials.map((m, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-4 flex flex-col justify-center text-center shadow-sm">
                                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                    <m.icon size={24} className="text-blue-600" />
                                </div>
                                <h4 className="font-bold text-sm text-black">{m.title}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{m.spec}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{m.brand}</p>

                                <div className="mt-2 w-max mx-auto px-2 py-0.5 rounded bg-blue-50 text-blue-500 text-[8px] font-bold">
                                    {m.badge}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-[#F8F9FA] absolute bottom-0 left-0 right-0">
                    <button
                        onClick={handleCalculate}
                        className="w-full bg-[#1890FF] text-white py-4 rounded-xl font-bold transition-colors"
                    >
                        Calculate Premium Budget
                    </button>
                </div>
            </div>
        );
    }

    // Basic Selection
    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative">
            <div className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-black" />
                </button>
            </div>

            <div className="px-6 flex-1 overflow-y-auto pb-24 hide-scrollbar">
                <h1 className="text-3xl font-bold text-[#001A3F]">Basic Selection</h1>
                <p className="text-gray-500 mt-2 mb-8">Value-for-money options for budget-friendly homes.</p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    {materials.map((m, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-2xl p-4 flex flex-col justify-center text-center shadow-sm">
                            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 flex-shrink-0">
                                <m.icon size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-black">{m.title}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{m.spec}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-white absolute bottom-0 left-0 right-0">
                <button
                    onClick={handleCalculate}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold transition-colors"
                >
                    Calculate Basic Budget
                </button>
            </div>
        </div>
    );
};

export default PackageSelectionPage;
