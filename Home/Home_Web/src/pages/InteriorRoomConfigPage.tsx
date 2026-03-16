import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowLeft, ArrowRight, Check, Image as ImageIcon } from 'lucide-react';

const formatTitle = (path: string) => {
    switch (path) {
        case 'living-room': return 'Living Room Interiors';
        case 'bedroom': return 'Bedroom Interiors';
        case 'kitchen': return 'Kitchen Interiors';
        case 'dining-room': return 'Dining Room Interiors';
        case 'foyer': return 'Foyer Room Interior';
        case 'bathroom': return 'Bathroom Interiors';
        default: return 'Room Setup';
    }
};

// Image Imports
import tvUnitLiving from '../assets/interior/tv_unitliving.png';
import sofa from '../assets/interior/sofa.png';
import wallArtLiving from '../assets/interior/wall_artliving.png';
import livingCeiling from '../assets/interior/living_ceiling.png';

import dressUnit from '../assets/interior/dress_unit.png';
import wardrobe from '../assets/interior/wardrobe.png';
import tvUnitBed from '../assets/interior/tv_unit.png';
import bed from '../assets/interior/bed.png';
import cotTable from '../assets/interior/cot_table.png';
import bedBackWall from '../assets/interior/bed_backwall.png';
import bedroomCeiling from '../assets/interior/bedroom_ceiling.png';

import pantryUnit from '../assets/interior/pantry_unit.png';
import bottlePullout from '../assets/interior/bottle_pullout.png';
import tandemDrawer from '../assets/interior/tandem_drawer.png';
import rollingShutter from '../assets/interior/rolling_shutter.png';
import loftCabinets from '../assets/interior/loft_cabinets.png';
import middleCabinet from '../assets/interior/middle_cabinet.png';
import baseCabinet from '../assets/interior/base_cabinet.png';
import kitchenCeiling from '../assets/interior/kitchen_ceiling.png';

import crockeryUnit from '../assets/interior/crockery_unit.png';
import diningTable from '../assets/interior/dining_table.png';
import diningCeiling from '../assets/interior/dining_ceiling.png';

import velvetBench from '../assets/interior/velvet_bench.webp';
import foyerAbstract from '../assets/interior/foyer_abstract.webp';
import globeChandelier from '../assets/interior/globe_chandelier.jpeg';

import frameless from '../assets/interior/frameless.jpg';
import mirror from '../assets/interior/mirror.jpg';
import bathTub from '../assets/interior/bath_tub.jpg';

const ITEM_IMAGES: Record<string, string> = {
    // Living Room
    'TV Unit (Living)': tvUnitLiving,
    'Sofa': sofa,
    'Wall Art': wallArtLiving,
    'Ceiling (Living)': livingCeiling,

    // Bedroom
    'Dress Unit': dressUnit,
    'Wardrobe': wardrobe,
    'TV Unit (Bedroom)': tvUnitBed,
    'Bed': bed,
    'Cot with Table': cotTable,
    'Bed Back Wall': bedBackWall,
    'Ceiling (Bedroom)': bedroomCeiling,

    // Kitchen
    'Pantry Unit': pantryUnit,
    'Bottle Pullout': bottlePullout,
    'Tandem Drawer': tandemDrawer,
    'Rolling Shutter': rollingShutter,
    'Loft Cabinets': loftCabinets,
    'Middle Cabinet': middleCabinet,
    'Base Cabinet': baseCabinet,
    'Ceiling (Kitchen)': kitchenCeiling,

    // Dining
    'Crockery Unit': crockeryUnit,
    'Dining Table': diningTable,
    'Ceiling Design': diningCeiling,

    // Foyer
    'Velvet Bench': velvetBench,
    'Abstract Canvas': foyerAbstract,
    'Globe Chandelier': globeChandelier,

    // Bathroom
    'Frameless Glass Partition': frameless,
    'Floating Vanity & Mirror': mirror,
    'Freestanding Tub': bathTub
};

const getRoomItems = (path: string) => {
    switch (path) {
        case 'living-room':
            return ['TV Unit (Living)', 'Sofa', 'Wall Art', 'Ceiling (Living)'];
        case 'bedroom':
            return ['Dress Unit', 'Wardrobe', 'TV Unit (Bedroom)', 'Bed', 'Cot with Table', 'Bed Back Wall', 'Ceiling (Bedroom)'];
        case 'kitchen':
            return ['Pantry Unit', 'Bottle Pullout', 'Tandem Drawer', 'Rolling Shutter', 'Loft Cabinets', 'Middle Cabinet', 'Base Cabinet', 'Ceiling (Kitchen)'];
        case 'dining-room':
            return ['Crockery Unit', 'Dining Table', 'Ceiling Design'];
        case 'foyer':
            return ['Velvet Bench', 'Abstract Canvas', 'Globe Chandelier'];
        case 'bathroom':
            return ['Frameless Glass Partition', 'Floating Vanity & Mirror', 'Freestanding Tub'];
        default:
            return [];
    }
};

const InteriorRoomConfigPage = () => {
    const navigate = useNavigate();
    const { state, updateInterior } = useProject();
    const { roomName } = useParams<{ roomName: string }>();
    const title = formatTitle(roomName || '');
    const items = getRoomItems(roomName || '');

    const [step, setStep] = useState(1); // 1 = Selection, 2 = Dimensions
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [dimensions, setDimensions] = useState<Record<string, { l: string, w: string, unit: string }>>({});

    const handleToggleItem = (item: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(item)) newSet.delete(item);
        else newSet.add(item);
        setSelectedItems(newSet);
    };

    const handleUpdateDimension = (item: string, field: 'l' | 'w' | 'unit', value: string) => {
        setDimensions(prev => ({
            ...prev,
            [item]: {
                ...(prev[item] || { l: '', w: '', unit: 'Feet' }),
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        const requests = Array.from(selectedItems).map(item => {
            const dim = dimensions[item] || { l: '0', w: '0', unit: 'ft' };
            const l = parseFloat(dim.l) || 0;
            const w = parseFloat(dim.w) || 0;
            return {
                customer_name: title,
                work_type: item,
                length: l,
                height: w,
                depth: 1.0,
                multiplier: 1.0,
                packageId: 1,
                unit_type: dim.unit === 'Feet' ? 'ft' : dim.unit === 'Inches' ? 'in' : 'mm'
            };
        });

        // Add to global state
        const newRooms = Array.from(new Set([...(state.interior.rooms || []), title]));
        updateInterior({
            rooms: newRooms,
            roomConfigs: {
                ...(state.interior.roomConfigs || {}),
                [title]: requests
            }
        });

        // Return to selection
        navigate(`/interior/selection/${state.interior.packageType}`);
    };

    const isStep2Valid = Array.from(selectedItems).some(item => {
        const dim = dimensions[item];
        return dim && parseFloat(dim.l) > 0 && parseFloat(dim.w) > 0;
    });

    if (step === 2) {
        return (
            <div className="flex flex-col h-full bg-[#FAFAFA] w-full max-w-7xl mx-auto relative px-6">
                <div className="flex items-center justify-between py-4">
                    <button onClick={() => setStep(1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200">
                        <ArrowLeft size={24} className="text-gray-500" />
                    </button>
                    <span className="font-bold text-[#001A3F]">{title} Dimensions</span>
                    <div className="w-10"></div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
                    <h1 className="text-2xl font-bold text-[#0F172A] mt-4">Enter dimensions</h1>
                    <p className="text-[#64748B] text-sm mt-2 mb-8">
                        Provide accurate measurements for your interior elements.
                    </p>

                    {Array.from(selectedItems).map(item => (
                        <DimensionCard
                            key={item}
                            title={item}
                            data={dimensions[item] || { l: '', w: '', unit: 'Feet' }}
                            onChange={(f, v) => handleUpdateDimension(item, f, v)}
                        />
                    ))}

                    {selectedItems.size === 0 && (
                        <p className="text-center text-gray-400 mt-10">No items selected.</p>
                    )}
                </div>

                <div className="pb-10 pt-4 bg-[#FAFAFA] flex justify-center">
                    <button
                        onClick={handleSave}
                        disabled={!isStep2Valid && selectedItems.size > 0}
                        className={`w-full h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all ${isStep2Valid || selectedItems.size === 0
                            ? 'bg-[#2962FF] shadow-[0_8px_16px_rgba(41,98,255,0.4)] text-white hover:bg-blue-700'
                            : 'bg-[#CBD5E1] text-white cursor-not-allowed'
                            }`}
                    >
                        Save & Continue <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative px-6">
            <div className="flex items-center justify-between py-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-gray-500" />
                </button>
                <span className="font-bold text-[#001A3F]">{title}</span>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
                <h1 className="text-2xl font-bold text-[#0F172A] mt-4">Curate your space</h1>
                <p className="text-[#64748B] text-sm mt-2 mb-8">
                    Select the core components for your {title.toLowerCase()}.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {items.map(item => {
                        const isSelected = selectedItems.has(item);
                        return (
                            <div
                                key={item}
                                className={`w-full rounded-[20px] transition-all outline outline-2 bg-white overflow-hidden flex flex-col ${isSelected ? 'outline-[#2962FF] shadow-sm' : 'outline-[#E2E8F0]'}`}
                            >
                                <div className="h-[130px] w-full bg-[#F8FAFC] relative flex items-center justify-center">
                                    {ITEM_IMAGES[item] ? (
                                        <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden shadow-sm border border-white bg-white">
                                            <img src={ITEM_IMAGES[item]} alt={item} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border border-white">
                                            <ImageIcon size={32} className="text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {isSelected ? (
                                            <div className="w-6 h-6 bg-[#2962FF] rounded-full flex items-center justify-center shadow-md">
                                                <Check size={14} className="text-white" strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center bg-white/50">
                                                <Check size={14} className="text-white opacity-0" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col items-center gap-3 text-center flex-1 justify-between border-t border-slate-100">
                                    <div className="w-full">
                                        <h3 className="font-bold text-[#0F172A] text-[14px] leading-snug">{item}</h3>
                                    </div>
                                    <button
                                        onClick={() => handleToggleItem(item)}
                                        className={`w-full py-2 rounded-xl font-bold text-[11px] transition-colors ${isSelected
                                            ? 'bg-[#EBF2FF] text-[#2962FF]'
                                            : 'bg-[#F1F5F9] text-[#2962FF] hover:bg-[#E2E8F0]'
                                            }`}
                                    >
                                        {isSelected ? 'SELECTED' : 'NOT SELECTED'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="pb-10 pt-4 bg-white flex justify-center">
                <button
                    onClick={() => setStep(2)}
                    className="w-full h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all bg-[#2962FF] text-white hover:bg-blue-700"
                >
                    Continue to Layout <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

const DimensionCard = ({ title, data, onChange }: {
    title: string;
    data: { l: string, w: string, unit: string };
    onChange: (field: 'l' | 'w' | 'unit', value: string) => void
}) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#EBF2FF] rounded-lg flex items-center justify-center overflow-hidden">
                    {ITEM_IMAGES[title] ? (
                        <img src={ITEM_IMAGES[title]} alt="thumbnail" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={20} className="text-[#2962FF]" />
                    )}
                </div>
                <h3 className="font-bold text-[#1F2937] text-lg">{title}</h3>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="text-[11px] font-bold text-[#94A3B8] mb-2 block">LENGTH</label>
                    <input
                        type="number"
                        value={data.l}
                        onChange={e => onChange('l', e.target.value)}
                        placeholder="0.0"
                        className="w-full h-12 bg-[#F1F5F9] rounded-xl px-4 outline-none focus:border focus:border-[#2962FF] text-black font-medium"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-[11px] font-bold text-[#94A3B8] mb-2 block">HEIGHT/DEPTH</label>
                    <input
                        type="text"
                        value={data.w}
                        onChange={e => onChange('w', e.target.value)}
                        placeholder="0.0"
                        className="w-full h-12 bg-[#F1F5F9] rounded-xl px-4 outline-none focus:border focus:border-[#2962FF] text-black font-medium"
                    />
                </div>
            </div>

            <div className="flex w-full h-12 bg-[#E2E8F0] rounded-xl p-1">
                {['Feet', 'Inches', 'mm'].map(u => (
                    <button
                        key={u}
                        onClick={() => onChange('unit', u)}
                        className={`flex-1 rounded-lg text-sm font-medium transition-colors ${data.unit === u
                            ? 'bg-white text-[#2962FF] shadow-sm font-bold'
                            : 'text-[#64748B]'
                            }`}
                    >
                        {u}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InteriorRoomConfigPage;
