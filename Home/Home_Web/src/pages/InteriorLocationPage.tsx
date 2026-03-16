import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Building2, MapPin, Building, ArrowLeft, ArrowRight } from 'lucide-react';

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

const InteriorLocationPage = () => {
    const navigate = useNavigate();
    const { state, updateInterior } = useProject();

    const [selectedState, setSelectedState] = useState(state.interior.state || '');
    const [selectedCity, setSelectedCity] = useState(state.interior.location || '');
    const [isStateOpen, setIsStateOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);

    const handleNext = () => {
        updateInterior({
            state: selectedState,
            location: selectedCity,
        });
        navigate('/interior/package');
    };

    const isButtonEnabled = selectedState && selectedCity;

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative px-6">
            <div className="flex items-center py-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-black" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col items-center pb-8" onClick={() => { if (isStateOpen) setIsStateOpen(false); if (isCityOpen) setIsCityOpen(false); }}>
                <Spacer height={16} />

                <h1 className="text-[32px] leading-tight font-bold text-black w-full text-center">
                    Choose Your Location
                </h1>

                <Spacer height={8} />

                <p className="text-gray-500 text-base w-full text-center">
                    Interior material pricing varies by state and city.
                </p>

                <Spacer height={48} />

                {/* Blue Box with Icon */}
                <div className="w-[140px] h-[140px] rounded-[24px] bg-[#4C84FF] flex items-center justify-center">
                    <Building2 size={60} className="text-white" />
                </div>

                <Spacer height={48} />

                {/* State Selection */}
                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                    <label className="block text-xs font-bold text-black tracking-widest mb-3 uppercase text-left">
                        State
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <MapPin size={20} className="text-black" />
                        </div>
                        <div
                            onClick={() => setIsStateOpen(!isStateOpen)}
                            className={`w-full appearance-none bg-white border ${isStateOpen ? 'border-black' : 'border-[#F1F5F9]'} text-black font-medium pl-12 pr-10 py-4 rounded-2xl outline-none transition-colors cursor-pointer flex items-center`}
                        >
                            <span className="flex-1 text-left">{selectedState || 'Select State'}</span>
                        </div>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`text-black transition-transform ${isStateOpen ? 'rotate-180' : ''}`}>
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {isStateOpen && (
                            <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[240px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                                {Object.keys(statesAndDistricts).map(s => (
                                    <div
                                        key={s}
                                        className="p-4 hover:bg-gray-50 cursor-pointer text-gray-800 font-medium border-b border-gray-100 last:border-0 text-left"
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
                </div>

                <Spacer height={24} />

                {/* City Selection */}
                <div className={`w-full ${!selectedState ? 'opacity-50' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <label className="block text-xs font-bold text-black tracking-widest mb-3 uppercase text-left">
                        City
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Building size={20} className="text-black" />
                        </div>
                        <div
                            onClick={() => selectedState && setIsCityOpen(!isCityOpen)}
                            className={`w-full appearance-none font-medium pl-12 pr-10 py-4 rounded-2xl outline-none transition-colors border text-black flex items-center ${selectedState ? `bg-[#F1F5F9] cursor-pointer ${isCityOpen ? 'border-black bg-white' : 'border-transparent'}` : 'bg-gray-100 cursor-not-allowed border-transparent'}`}
                        >
                            <span className="flex-1 text-left">{selectedCity || 'Select City'}</span>
                        </div>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`text-black transition-transform ${isCityOpen ? 'rotate-180' : ''}`}>
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {isCityOpen && selectedState && (
                            <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[240px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                                {statesAndDistricts[selectedState]?.map((c: string) => (
                                    <div
                                        key={c}
                                        className="p-4 hover:bg-gray-50 cursor-pointer text-gray-800 font-medium border-b border-gray-100 last:border-0 text-left"
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
                </div>

                <Spacer height={48} />
            </div>

            <div className="pb-12 bg-white pt-4">
                <button
                    onClick={handleNext}
                    disabled={!isButtonEnabled}
                    className={`w-full h-[60px] rounded-[20px] font-bold text-xl flex items-center justify-center gap-2 transition-all ${isButtonEnabled
                        ? 'bg-[#4C84FF] text-white shadow-[0_8px_20px_rgba(76,132,255,0.4)] hover:bg-blue-600'
                        : 'bg-[#94B4FF] text-white cursor-not-allowed'
                        }`}
                >
                    Continue <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
};

const Spacer = ({ height }: { height: number }) => <div style={{ height: `${height}px` }} />;

export default InteriorLocationPage;
