import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Target, Gem, Crown, MapPin, Ruler, Box, Waves, BrickWall, Hammer, Grip, DoorOpen, LayoutGrid, Plug, PaintRoller, Layers, Grid, Shield, PaintBucket, CheckSquare, Wrench } from 'lucide-react';

import cementImg from '../assets/interior/cement.jpg';
import sandImg from '../assets/interior/sand.jpg';
import bricksImg from '../assets/interior/bricks.jpg';
import ironImg from '../assets/interior/iron.jpg';
import aggregateImg from '../assets/interior/aggregates.webp';
import windowImg from '../assets/interior/windows.jpg';
import tilesImg from '../assets/interior/tiles.jpg';
import electricalImg from '../assets/interior/electrical.jpg';
import paintingImg from '../assets/interior/painting.png';

const statesAndDistricts: Record<string, string[]> = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
    'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Ziro'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur'],
    'Goa': ['Panaji', 'Vasco da Gama', 'Margao'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
    'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Manipur': ['Imphal'],
    'Meghalaya': ['Shillong'],
    'Mizoram': ['Aizawl'],
    'Nagaland': ['Dimapur', 'Kohima'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    'Sikkim': ['Gangtok'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Tripura': ['Agartala'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee'],
    'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri']
};

const allCities = Object.values(statesAndDistricts).flat().sort();

const materialData: Record<string, any[]> = {
    'Basic': [
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
    'Premium': [
        { title: 'Cement', spec: 'Grade 53 OPC', brand: 'UltraTech / ACC', icon: Layers },
        { title: 'Sand', spec: 'P-Sand / Filtered', brand: 'River Sand Alt', icon: Waves },
        { title: 'Bricks', spec: 'AAC Blocks', brand: 'Magicrete', icon: Grid },
        { title: 'Iron & Steel', spec: 'Fe 550D Grade', brand: 'Tata Tiscon / JSW', icon: Hammer },
        { title: 'Aggregate', spec: '20mm Crushed', brand: 'Machine Graded', icon: Layers },
        { title: 'Windows', spec: 'UPVC & Teak', brand: 'Fenesta', icon: LayoutGrid },
        { title: 'Tiles', spec: 'GVT Vitrified', brand: 'Kajaria / Somany', icon: Grid },
        { title: 'Electrical', spec: 'Modular Switches', brand: 'Havells / Legrand', icon: Wrench },
        { title: 'Painting', spec: 'Prem. Emulsion', brand: 'Asian Royale / Apex', icon: PaintBucket }
    ],
    'Luxury': [
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

const ConstructionFlow = () => {
    const { state, updateConstruction } = useProject();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Local state for the wizard
    const [pkg, setPkg] = useState(state.construction.packageType);
    const [selectedState, setSelectedState] = useState('');
    const [loc, setLoc] = useState('');
    const [area, setArea] = useState(state.construction.area);
    const [floors, setFloors] = useState(state.construction.floors);

    const handleNextStep1 = () => {
        updateConstruction({ packageType: pkg });
        setStep(2);
    };

    const handleNextStep2 = () => {
        updateConstruction({ state: selectedState, location: loc, area, floors });
        setStep(3);
    };

    const handleCalculate = () => {
        navigate('/construction/cost-estimate');
    };

    const handleOptimization = () => {
        navigate('/construction/optimization');
    };

    if (step === 1) {
        return (
            <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Select Construction Package</h2>
                <div className="space-y-4">
                    {[
                        { id: 'Basic', icon: Target, desc: 'Standard materials for affordable building.' },
                        { id: 'Premium', icon: Gem, desc: 'High-quality materials with better finish.' },
                        { id: 'Luxury', icon: Crown, desc: 'Top-tier materials and premium fittings.' }
                    ].map(p => (
                        <div
                            key={p.id}
                            onClick={() => setPkg(p.id)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${pkg === p.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-200'}`}
                        >
                            <div className={`p-3 rounded-full ${pkg === p.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                <p.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{p.id} Package</h3>
                                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${pkg === p.id ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300'}`}>
                                {pkg === p.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleNextStep1}
                    className="mt-auto w-full bg-orange-600 text-white py-3.5 rounded-xl font-medium shadow-lg hover:bg-orange-700 transition"
                >
                    Next
                </button>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Project Location & Size</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} /> Select State</label>
                        <select
                            value={selectedState}
                            onChange={(e) => {
                                setSelectedState(e.target.value);
                                setLoc('');
                            }}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm cursor-pointer"
                        >
                            <option value="" disabled>Select a State</option>
                            {Object.keys(statesAndDistricts).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} /> Select City</label>
                        <select
                            value={loc}
                            onChange={(e) => {
                                const newCity = e.target.value;
                                setLoc(newCity);
                                if (!selectedState) {
                                    const foundState = Object.keys(statesAndDistricts).find(s => statesAndDistricts[s].includes(newCity));
                                    if (foundState) setSelectedState(foundState);
                                }
                            }}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm cursor-pointer"
                        >
                            <option value="" disabled>Select a City</option>
                            {(selectedState ? statesAndDistricts[selectedState] : allCities).map((c: string) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Ruler size={16} /> Built-up Area (Sq.Ft)</label>
                        <input
                            type="number"
                            value={area}
                            onChange={e => setArea(Number(e.target.value))}
                            placeholder="e.g. 1000"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Floors</label>
                        <div className="flex gap-3">
                            {['Ground', 'G + 1', 'Custom'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFloors(f)}
                                    className={`flex-1 py-3 px-2 rounded-xl border text-sm font-medium transition-all ${floors === f ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    <button
                        onClick={handleNextStep2}
                        disabled={!loc}
                        className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-medium shadow-[0_4px_14px_rgba(234,88,12,0.39)] hover:bg-orange-700 transition disabled:bg-gray-300 disabled:shadow-none"
                    >
                        View Material Details
                    </button>
                </div>
            </div>
        );
    }

    if (step === 3) {
        const materials = materialData[pkg] || materialData['Basic'];
        const isLuxury = pkg === 'Luxury';
        const isPremium = pkg === 'Premium';

        return (
            <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col bg-gray-50">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{pkg} Selection</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isLuxury ? 'Curated premium materials for high-end residential construction.' :
                            isPremium ? 'Standard package with enhanced quality and style.' :
                                'Value-for-money options for budget-friendly homes.'}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar pb-6 pt-1">
                    {/* The container is conditionally styled based on package type */}
                    <div className={isLuxury ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                        {materials.map((m, idx) => {
                            if (isLuxury) {
                                return (
                                    <div key={idx} className="relative rounded-3xl h-28 overflow-hidden flex items-center shadow-md bg-white border border-gray-100">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${m.icon})` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-black/40"></div>

                                        <div className="p-4 relative z-10 flex flex-col justify-center h-full w-full">
                                            <div className="bg-white/20 w-max px-2 py-0.5 rounded-full text-[9px] font-bold text-white tracking-widest mb-1 backdrop-blur-sm">
                                                {m.brand}
                                            </div>
                                            <h4 className="text-lg font-black text-white mb-0.5 drop-shadow-md">{m.title}</h4>
                                            <p className="text-xs font-bold text-gray-100 drop-shadow-md">{m.spec}</p>
                                        </div>
                                        <div className="absolute right-4 top-1/2 -transform-y-1/2 z-10">
                                            <CheckSquare size={18} className="text-white/40" />
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
                                    <div className={`p-3 rounded-full flex-shrink-0 ${isPremium ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        <m.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 text-sm">{m.title}</h4>
                                        <p className="text-xs text-gray-600 mt-0.5">{m.spec}</p>
                                        {m.brand && (
                                            <p className={`text-[10px] uppercase font-bold mt-1 text-blue-500`}>{m.brand}</p>
                                        )}
                                    </div>
                                    <CheckSquare size={18} className="text-gray-300" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-auto space-y-3 pt-4">
                    {pkg === 'Basic' && (
                        <button
                            onClick={handleOptimization}
                            className="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-indigo-100 transition shadow-sm"
                        >
                            View AI Optimization
                        </button>
                    )}
                    <button
                        onClick={handleCalculate}
                        className={`w-full py-3.5 rounded-xl font-medium shadow-lg transition text-white
                            ${isLuxury ? 'bg-slate-800 hover:bg-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.39)]' :
                                isPremium ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.39)]' :
                                    'bg-orange-600 hover:bg-orange-700 shadow-[0_4px_14px_rgba(234,88,12,0.39)]'}`}
                    >
                        Calculate Budget
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default ConstructionFlow;
