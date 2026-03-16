import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';

interface RoomCost {
    name: string;
    cost: number;
}

const RoomLabelMap: Record<string, string> = {
    livingRoom: 'Living Room',
    bedroom: 'Bedroom',
    kitchen: 'Kitchen',
    diningRoom: 'Dining Room',
    foyer: 'Foyer',
    bathroom: 'Bathroom',
};

const InteriorCostSummary = () => {
    const { state, updateInterior } = useProject();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roomCosts, setRoomCosts] = useState<RoomCost[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchEstimate = async () => {
            try {
                setLoading(true);
                const res = await axios.post('http://localhost:4000/api/estimate/interior', {
                    location: state.interior.location,
                    packageType: state.interior.packageType,
                    rooms: state.interior.rooms
                });

                setRoomCosts(res.data.roomCosts);
                setTotal(res.data.total);
                updateInterior({ totalCost: res.data.total });
            } catch (err) {
                console.error(err);
                setError('Failed to fetch interior estimate');
            } finally {
                setLoading(false);
            }
        };

        fetchEstimate();
    }, [state.interior.packageType, state.interior.location, state.interior.rooms]);

    return (
        <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col bg-gray-50">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 bg-white">
                    <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-xl font-bold text-gray-800">Total {state.interior.packageType} Interior Cost</h2>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto mb-6 hide-scrollbar space-y-3">
                        {roomCosts.map((room, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <span className="font-medium text-gray-700">{RoomLabelMap[room.name] || room.name}</span>
                                <span className="font-bold text-teal-700">₹ {room.cost.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-teal-900 text-white rounded-2xl p-6 shadow-xl mb-4 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                        <p className="text-teal-200 text-sm mb-1 uppercase tracking-widest font-semibold">{state.interior.packageType} Package Details</p>
                        <h3 className="text-3xl font-bold">₹ {total.toLocaleString('en-IN')}</h3>
                    </div>

                    <div className="mt-auto pb-safe">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-medium shadow-[0_4px_14px_rgba(13,148,136,0.39)] hover:bg-teal-700 transition"
                        >
                            Back To Home
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default InteriorCostSummary;
