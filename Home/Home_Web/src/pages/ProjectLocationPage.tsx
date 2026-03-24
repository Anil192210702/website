import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { MapPin, Building, Ruler, ArrowLeft as ArrowLeftIcon, Plus, Home as HomeIcon, ChevronDown } from 'lucide-react';

// Comprehensive states and districts for India (from HomePlanner App)
const statesAndDistricts: Record<string, string[]> = {
    "Andhra Pradesh": [
        "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam",
        "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
    ],
    "Arunachal Pradesh": [
        "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi",
        "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang",
        "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang",
        "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"
    ],
    "Assam": [
        "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang",
        "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai",
        "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar",
        "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar",
        "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
    ],
    "Bihar": [
        "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar",
        "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur",
        "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger",
        "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur",
        "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
    ],
    "Chhattisgarh": [
        "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur",
        "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
        "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli",
        "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"
    ],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": [
        "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
        "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath",
        "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada",
        "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat",
        "Surendranagar", "Tapi", "Vadodara", "Valsad"
    ],
    "Haryana": [
        "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar",
        "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal",
        "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
    ],
    "Himachal Pradesh": [
        "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti",
        "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
    ],
    "Jharkhand": [
        "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih",
        "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga",
        "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"
    ],
    "Karnataka": [
        "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar",
        "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada",
        "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
        "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi",
        "Uttara Kannada", "Vijayapura", "Yadgir"
    ],
    "Kerala": [
        "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam",
        "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Trissur", "Wayanad"
    ],
    "Madhya Pradesh": [
        "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul",
        "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas",
        "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur",
        "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur",
        "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna",
        "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli",
        "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
    ],
    "Maharashtra": [
        "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
        "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
        "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik",
        "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
        "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
    ],
    "Manipur": [
        "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam",
        "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong",
        "Tengnoupal", "Thoubal", "Ukhrul"
    ],
    "Meghalaya": [
        "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
        "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
        "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
    ],
    "Mizoram": [
        "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei",
        "Mamit", "Saiha", "Saitual", "Serchhip"
    ],
    "Nagaland": [
        "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Noklak", "Peren",
        "Phek", "Tuensang", "Wokha", "Zunheboto"
    ],
    "Odisha": [
        "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Baudh", "Cuttack", "Deogarh",
        "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
        "Kandhamal", "Kendrapara", "Keonjhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj",
        "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
    ],
    "Punjab": [
        "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur",
        "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga",
        "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur",
        "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"
    ],
    "Rajasthan": [
        "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner",
        "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh",
        "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli",
        "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar",
        "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
    ],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": [
        "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
        "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri",
        "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur",
        "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur",
        "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur",
        "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
    ],
    "Telangana": [
        "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally",
        "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad",
        "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
        "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
        "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy",
        "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
    ],
    "Tripura": [
        "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"
    ],
    "Uttar Pradesh": [
        "Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya",
        "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda",
        "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr",
        "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur",
        "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur",
        "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj",
        "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar",
        "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau",
        "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
        "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur",
        "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur",
        "Unnao", "Varanasi"
    ],
    "Uttarakhand": [
        "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital",
        "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
    ],
    "West Bengal": [
        "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling",
        "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda",
        "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
        "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
    ],
    "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Delhi": [
        "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
        "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
    ],
    "Jammu and Kashmir": [
        "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu",
        "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri",
        "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"
    ],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Lakshadweep"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

const allCities = Object.values(statesAndDistricts).flat().sort();

const ProjectLocationPage = () => {
    const navigate = useNavigate();
    const { state, updateConstruction } = useProject();

    const [selectedState, setSelectedState] = useState(state.construction.state || '');
    const [selectedCity, setSelectedCity] = useState(state.construction.location || '');
    const [isStateOpen, setIsStateOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [landArea, setLandArea] = useState(state.construction.landArea?.toString() || '');
    const [builtUpArea, setBuiltUpArea] = useState(state.construction.area?.toString() || '');
    const [unit, setUnit] = useState(state.construction.unit || 'Sq. Feet');
    const [floors, setFloors] = useState(state.construction.floors || 'Ground');

    const handleNext = () => {
        updateConstruction({
            state: selectedState,
            location: selectedCity,
            landArea: Number(landArea),
            area: Number(builtUpArea),
            unit: unit,
            floors: floors
        });
        navigate('/construction/package');
    };

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative">
            <div className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon size={24} className="text-gray-800" />
                </button>
            </div>

            <div className="px-6 flex-1 overflow-y-auto pb-24 hide-scrollbar" onClick={() => { if (isStateOpen) setIsStateOpen(false); if (isCityOpen) setIsCityOpen(false); }}>
                <h1 className="text-3xl font-bold text-[#001A3F]">Project Location & Size</h1>
                <p className="text-gray-500 mt-2 mb-8">Tell us where and how big you want to build.</p>

                <div className="mb-5 relative" onClick={(e) => e.stopPropagation()}>
                    <div
                        onClick={() => setIsStateOpen(!isStateOpen)}
                        className="flex items-center gap-3 border border-gray-200 rounded-2xl p-4 focus-within:border-blue-600 transition-colors relative cursor-pointer"
                    >
                        <MapPin className="text-blue-600 flex-shrink-0" size={24} />
                        <div className={`flex-1 font-medium text-base ${selectedState ? 'text-gray-800' : 'text-gray-400'}`}>
                            {selectedState || 'Select State'}
                        </div>
                        <ChevronDown className={`text-gray-400 flex-shrink-0 transition-transform ${isStateOpen ? 'rotate-180' : ''}`} size={20} />
                    </div>
                    {isStateOpen && (
                        <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[240px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                            {Object.keys(statesAndDistricts).map(s => (
                                <div
                                    key={s}
                                    className="p-4 hover:bg-gray-50 cursor-pointer text-gray-800 font-medium border-b border-gray-100 last:border-0"
                                    onClick={() => {
                                        setSelectedState(s);
                                        setSelectedCity('');
                                        setIsStateOpen(false);
                                    }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* City */}
                <div className={`mb-8 relative ${!selectedState ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div
                        onClick={() => selectedState && setIsCityOpen(!isCityOpen)}
                        className={`flex items-center gap-3 border border-gray-200 rounded-2xl p-4 transition-colors relative ${selectedState ? 'focus-within:border-blue-600 cursor-pointer' : ''}`}
                    >
                        <Building className="text-blue-600 flex-shrink-0" size={24} />
                        <div className={`flex-1 font-medium text-base ${selectedCity ? 'text-gray-800' : 'text-gray-400'}`}>
                            {selectedCity || 'Select City / Zone'}
                        </div>
                        <ChevronDown className={`text-gray-400 flex-shrink-0 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} size={20} />
                    </div>
                    {isCityOpen && selectedState && (
                        <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[240px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                            {statesAndDistricts[selectedState]?.map((c: string) => (
                                <div
                                    key={c}
                                    className="p-4 hover:bg-gray-50 cursor-pointer text-gray-800 font-medium border-b border-gray-100 last:border-0"
                                    onClick={() => {
                                        setSelectedCity(c);
                                        setIsCityOpen(false);
                                    }}
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Areas */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 mb-2 block">LAND AREA</label>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-3 focus-within:border-blue-600 transition-colors">
                            <Ruler className="text-blue-600" size={20} />
                            <input
                                type="number"
                                placeholder="0"
                                value={landArea}
                                onChange={(e) => setLandArea(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-800 font-bold"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 mb-2 block">BUILT-UP AREA</label>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-3 focus-within:border-blue-600 transition-colors">
                            <HomeIcon className="text-blue-600" size={20} />
                            <input
                                type="number"
                                placeholder="0"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-800 font-bold"
                            />
                        </div>
                    </div>
                </div>
                {Number(builtUpArea) > Number(landArea) && landArea !== '' && (
                    <p className="text-red-500 text-xs font-medium mb-4">Built-up area cannot exceed land area</p>
                )}

                {/* Unit Toggle */}
                <div className="flex border border-gray-200 rounded-xl h-12 mb-8 overflow-hidden">
                    <button
                        onClick={() => setUnit('Sq. Feet')}
                        className={`flex-1 font-bold transition-colors ${unit === 'Sq. Feet' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        Sq. Feet
                    </button>
                    <button
                        onClick={() => setUnit('Sq. Meter')}
                        className={`flex-1 font-bold transition-colors ${unit === 'Sq. Meter' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        Sq. Meter
                    </button>
                </div>

                <h3 className="text-xl font-bold text-[#001A3F] mb-4">Select Number of Floors</h3>
                <div className="flex gap-3 mb-8">
                    {['Ground', 'G + 1', 'Custom'].map((f) => {
                        const isCustom = f === 'Custom';
                        const isSelected = isCustom ? (floors !== 'Ground' && floors !== 'G + 1') : floors === f;
                        const label = isCustom && isSelected ? floors : f;
                        return (
                            <button
                                key={f}
                                onClick={() => {
                                    if (isCustom) {
                                        // Simplified custom selection for the web demo
                                        const newFloor = window.prompt("Enter custom floor (e.g. G + 2)", "G + 2") || "G + 2";
                                        setFloors(newFloor);
                                    } else {
                                        setFloors(f);
                                    }
                                }}
                                className={`flex-1 h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${isSelected
                                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                                    : 'border-gray-200 bg-white text-gray-500 font-medium hover:bg-gray-50'
                                    }`}
                            >
                                {isCustom ? <Plus size={24} /> : <HomeIcon size={24} />}
                                <span className="text-xs mt-1">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 bg-white absolute bottom-0 left-0 right-0">
                <button
                    onClick={handleNext}
                    disabled={!selectedState || !selectedCity || !builtUpArea || !landArea || Number(builtUpArea) <= 0 || Number(builtUpArea) > Number(landArea)}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Next: Floor Details
                </button>
            </div>
        </div>
    );
};

export default ProjectLocationPage;
