import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Home, Gem, Crown, MapPin, CheckSquare, Square } from 'lucide-react';

const roomOptions = [
    { id: 'livingRoom', label: 'Living Room Interiors' },
    { id: 'bedroom', label: 'Bedroom Interiors' },
    { id: 'kitchen', label: 'Kitchen Interiors' },
    { id: 'diningRoom', label: 'Dining Room Interiors' },
    { id: 'foyer', label: 'Foyer Room Interior' },
    { id: 'bathroom', label: 'Bathroom Interiors' },
];

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

const InteriorFlow = () => {
    const { state, updateInterior } = useProject();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [pkg, setPkg] = useState(state.interior.packageType);
    const [selectedState, setSelectedState] = useState('');
    const [loc, setLoc] = useState('');
    const [rooms, setRooms] = useState<string[]>(state.interior.rooms || []);

    const handleNextStep1 = () => {
        updateInterior({ packageType: pkg });
        setStep(2);
    };

    const handleNextStep2 = () => {
        updateInterior({ location: loc });
        setStep(3);
    };

    const toggleRoom = (id: string) => {
        setRooms(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const handleCalculate = () => {
        updateInterior({ rooms });
        navigate('/interior/cost-summary');
    };

    if (step === 1) {
        return (
            <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Select Interior Package</h2>
                <div className="space-y-4">
                    {[
                        { id: 'Basic', icon: Home, desc: 'Quality essentials for a comfortable home.' },
                        { id: 'Premium', icon: Gem, desc: 'Designer elements and superior finish.' },
                        { id: 'Luxury', icon: Crown, desc: 'Bespoke designs with ultra-premium materials.' }
                    ].map(p => (
                        <div
                            key={p.id}
                            onClick={() => setPkg(p.id)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${pkg === p.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:border-teal-200'}`}
                        >
                            <div className={`p-3 rounded-full ${pkg === p.id ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'}`}>
                                <p.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{p.id} Package</h3>
                                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${pkg === p.id ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300'}`}>
                                {pkg === p.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleNextStep1}
                    className="mt-auto w-full bg-teal-600 text-white py-3.5 rounded-xl font-medium shadow-[0_4px_14px_rgba(13,148,136,0.39)] hover:bg-teal-700 transition"
                >
                    Next
                </button>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Project Location</h2>
                <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Home size={64} className="text-teal-200" />
                        <MapPin size={32} className="text-teal-600 absolute ml-8 mt-8" />
                    </div>
                    <div className="w-full space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
                            <select
                                value={selectedState}
                                onChange={(e) => {
                                    setSelectedState(e.target.value);
                                    setLoc(''); // Reset city when state changes
                                }}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="" disabled>Select a State</option>
                                {Object.keys(statesAndDistricts).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
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
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
                            >
                                <option value="" disabled>Select a City</option>
                                {(selectedState ? statesAndDistricts[selectedState] : allCities).map((c: string) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleNextStep2}
                    disabled={!loc}
                    className="mt-auto w-full bg-teal-600 text-white py-3.5 rounded-xl font-medium shadow-lg hover:bg-teal-700 transition disabled:bg-gray-300 disabled:shadow-none"
                >
                    Next
                </button>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="p-4 w-full max-w-7xl mx-auto h-full flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Room Selection</h2>
                <p className="text-sm text-gray-500 mb-6">Select the rooms you want to include in interior designing.</p>

                <div className="space-y-3 flex-1 overflow-y-auto pb-4 hide-scrollbar">
                    {roomOptions.map(room => (
                        <div
                            key={room.id}
                            onClick={() => toggleRoom(room.id)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${rooms.includes(room.id) ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'}`}
                        >
                            <span className="font-medium text-gray-800">{room.label}</span>
                            {rooms.includes(room.id) ? (
                                <CheckSquare size={20} className="text-teal-600" />
                            ) : (
                                <Square size={20} className="text-gray-300" />
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleCalculate}
                    disabled={rooms.length === 0}
                    className={`mt-auto w-full py-3.5 rounded-xl font-medium shadow-lg transition ${rooms.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-[0_4px_14px_rgba(13,148,136,0.39)]'}`}
                >
                    Continue ({rooms.length})
                </button>
            </div>
        );
    }

    return null;
};

export default InteriorFlow;
