import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowLeft, Armchair, BedDouble, ChefHat, Utensils, DoorOpen, Bath, ChevronRight } from 'lucide-react';

const roomsList = [
    { name: "Living Room Interiors", icon: Armchair, path: "living-room" },
    { name: "Bedroom Interiors", icon: BedDouble, path: "bedroom" },
    { name: "Kitchen Interiors", icon: ChefHat, path: "kitchen" },
    { name: "Dining Room Interiors", icon: Utensils, path: "dining-room" },
    { name: "Foyer Room Interior", icon: DoorOpen, path: "foyer" },
    { name: "Bathroom Interiors", icon: Bath, path: "bathroom" }
];

const InteriorRoomSelectionPage = () => {
    const navigate = useNavigate();
    const { state } = useProject();
    const { packageType } = useParams<{ packageType: string }>();

    // Completed rooms are those that have configuration saved (for now relying on ProjectContext rooms array)
    const completedRooms = state.interior.rooms || [];
    const isFilled = completedRooms.length > 0;

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA] w-full max-w-7xl mx-auto relative px-6">
            <div className="flex items-center py-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200">
                    <ArrowLeft size={24} className="text-gray-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
                {/* Header Card */}
                <div className="w-full bg-gradient-to-r from-[#4285F4] to-[#24C1ED] rounded-xl p-8 mb-8">
                    <h1 className="text-white text-[26px] font-bold">
                        {packageType || 'Premium'} Selection
                    </h1>
                    <p className="text-white/90 text-sm mt-2">
                        Choose the room you want to design
                    </p>
                </div>

                {/* Rooms Grid / List */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Note: roomsList is a global array, mapped directly here */}
                    {roomsList.map((room) => {
                        const isSelected = completedRooms.includes(room.name);
                        return (
                            <div
                                key={room.name}
                                onClick={() => navigate(`/interior/room-config/${room.path}`)}
                                className={`w-full rounded-2xl cursor-pointer transition-all border ${isSelected
                                    ? 'bg-[#F2F6FF] border-[#2962FF]'
                                    : 'bg-white border-transparent shadow-sm'
                                    }`}
                            >
                                <div className="p-8 flex flex-col items-center justify-center">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isSelected ? 'bg-white' : 'bg-[#F2F7FF]'
                                        }`}>
                                        <room.icon size={28} className="text-[#2962FF]" />
                                    </div>
                                    <span className={`text-base font-bold ${isSelected ? 'text-[#2962FF]' : 'text-[#1F2937]'
                                        }`}>
                                        {room.name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="pb-10 pt-4 bg-[#FAFAFA] flex justify-center">
                <button
                    onClick={() => {
                        if (isFilled) navigate(`/interior/total-cost/${packageType}`);
                    }}
                    disabled={!isFilled}
                    className={`w-[90%] h-[60px] rounded-2xl text-white font-bold text-xl flex items-center justify-center gap-4 transition-all ${isFilled
                        ? 'bg-[#2962FF] shadow-[0_8px_16px_rgba(41,98,255,0.4)] hover:bg-blue-700'
                        : 'bg-[#94B4FF] cursor-not-allowed'
                        }`}
                >
                    Continue ({completedRooms.length})
                    {isFilled && <ChevronRight size={24} className="text-white" />}
                </button>
            </div>
        </div>
    );
};

export default InteriorRoomSelectionPage;
