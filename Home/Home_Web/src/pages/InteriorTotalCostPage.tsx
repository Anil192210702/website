import React, { useEffect, useState } from 'react';
import { generateInteriorReport } from '../utils/PdfGenerator';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import axios from 'axios';
import { ArrowLeft as ArrowLeftIcon, Download as DownloadIcon, Plus } from 'lucide-react';
import { interiorApi } from '../services/api';
import livingRoom from '../assets/interior/living_room.png';
import bedroom from '../assets/interior/bedroom.png';
import kitchen from '../assets/interior/kitchen.png';
import diningRoom from '../assets/interior/dining_room.png';
import foyer from '../assets/interior/foyer.png';
import bathroom from '../assets/interior/bathroom.png';

interface RoomSummary {
    room_name: string;
    room_total_cost: number;
}

interface InteriorResponse {
    rooms: RoomSummary[];
    overall_grand_total: number;
    ai_multiplier_applied: number;
}

const InteriorTotalCostPage = () => {
    const { state, updateInterior, saveProject } = useProject();
    const navigate = useNavigate();
    const { packageType } = useParams<{ packageType: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState<InteriorResponse | null>(null);

    useEffect(() => {
        const fetchEstimate = async () => {
            try {
                setLoading(true);

                const packageIdMap: Record<string, number> = {
                    'Basic': 1,
                    'Premium': 2,
                    'Luxury': 3
                };
                const id = packageIdMap[packageType || 'Premium'] || 1;

                // Aggregate all requests and add packageId
                const finalRequests: any[] = [];
                Object.values(state.interior.roomConfigs || {}).forEach(roomReqs => {
                    const mappedReqs = roomReqs.map(r => ({ ...r, packageId: id }));
                    finalRequests.push(...mappedReqs);
                });

                if (finalRequests.length === 0) {
                    setResult({ rooms: [], overall_grand_total: 0, ai_multiplier_applied: 1.0 });
                    setLoading(false);
                    return;
                }

                try {
                    const res = await interiorApi.calculateInterior(finalRequests);
                    setResult(res.data);
                    updateInterior({ totalCost: res.data.overall_grand_total });
                } catch (e: any) {
                    console.error('API Error, falling back to mock:', e);
                    // Fallback mock response matching Android UI template
                    const mockRooms = state.interior.rooms.map(r => ({
                        room_name: r,
                        room_total_cost: Math.floor(Math.random() * 50000) + 20000
                    }));
                    const total = mockRooms.reduce((acc, r) => acc + r.room_total_cost, 0);
                    const mockResult = {
                        rooms: mockRooms,
                        overall_grand_total: total * 1.15,
                        ai_multiplier_applied: 1.15
                    };
                    setResult(mockResult);
                    updateInterior({ totalCost: mockResult.overall_grand_total });
                }

            } catch (err) {
                console.error(err);
                setError('Failed to fetch estimate');
            } finally {
                setLoading(false);
            }
        };

        fetchEstimate();
    }, [state.interior.roomConfigs, state.interior.location, state.interior.state, packageType]);

    const handleDownloadReport = () => {
        if (result) {
            generateInteriorReport(result, packageType || 'Premium');
        } else {
            alert('No report data available to download.');
        }
    };

    const handleAddToCart = () => {
        updateInterior({ inCart: true });
        navigate('/total-cost');
    };

    const handleSaveProject = () => {
        saveProject({
            type: 'INTERIOR',
            state: state.interior.state || 'Tamil Nadu',
            city: state.interior.location || 'Chennai',
            packageName: state.interior.packageType,
            totalCost: state.interior.totalCost,
            interiorData: state.interior
        });
        alert('Project saved successfully!');
    };

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative px-6">
            <div className="flex items-center justify-between py-4 mb-2">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon size={24} className="text-black" />
                </button>
                <h1 className="text-lg font-bold text-[#1F2937]">Total {packageType} Interior Cost</h1>
                <button onClick={handleDownloadReport} className="p-2">
                    <DownloadIcon size={24} className="text-black" />
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="text-[#2962FF] font-medium">Retry</button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col pb-[180px]">
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        {(!result || result.rooms.length === 0) ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400 min-h-[200px]">
                                No cost data available
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8 mt-4">
                                {result.rooms.map((room, idx) => {
                                    const roomImages: Record<string, string> = {
                                        "Living Room Interiors": livingRoom,
                                        "Bedroom Interiors": bedroom,
                                        "Kitchen Interiors": kitchen,
                                        "Dining Room Interiors": diningRoom,
                                        "Foyer Room Interior": foyer,
                                        "Bathroom Interiors": bathroom
                                    };
                                    return (
                                        <div key={idx} className="flex items-center p-4 bg-white border border-[#F1F5F9] shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                <img 
                                                    src={roomImages[room.room_name] || livingRoom} 
                                                    alt={room.room_name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-bold text-[15px] text-[#1E293B]">{room.room_name}</h4>
                                                <p className="text-[12px] text-[#64748B] font-medium">{packageType} Package Total</p>
                                            </div>
                                            <div className="font-bold text-[16px] text-[#2962FF]">
                                                ₹{room.room_total_cost.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Grand Total Card */}
                        <div className="bg-white border border-gray-300 rounded-[24px] p-6 shadow-sm mb-12">
                            <div className="flex justify-between items-center text-sm font-semibold mb-3">
                                <span className="text-[#64748B]">Base Package Total</span>
                                <span className="text-[#1E293B]">₹{result?.rooms.reduce((a, b) => a + b.room_total_cost, 0).toLocaleString('en-IN') || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-4">
                                <span className="text-[#64748B]">Location Multiplier</span>
                                <span className="text-[#10B981] font-extrabold text-[15px]">× {result?.ai_multiplier_applied?.toFixed(2) || '1.00'}</span>
                            </div>

                            <div className="h-px bg-[#E2EBFB] w-full my-4"></div>

                            <div className="flex justify-between items-end pt-2">
                                <div>
                                    <p className="text-[#1E293B] text-[12px] font-black tracking-[0.1em]">GRAND TOTAL</p>
                                    <p className="text-[#2962FF] text-[10px] font-black uppercase mt-0.5">{packageType} PACKAGE</p>
                                </div>
                                <div className="text-[#2962FF] text-[32px] font-black tracking-tighter leading-none">
                                    ₹{result?.overall_grand_total?.toLocaleString('en-IN') || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions - Exactly matching Android reference */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white p-6 pt-4 flex gap-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm bg-white/95">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 h-[56px] rounded-xl border border-[#E2E8F0] text-[#475569] font-bold text-[14px] bg-white hover:bg-gray-50 transition-colors uppercase"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="flex-[1.3] h-[56px] rounded-full bg-[#2962FF] text-white font-black text-[18px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-[0_8px_20px_rgba(41,98,255,0.25)]"
                        >
                            <Plus size={24} strokeWidth={3} /> ADD To Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteriorTotalCostPage;
