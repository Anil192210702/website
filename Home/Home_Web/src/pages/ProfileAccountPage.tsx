import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  X, 
  User, 
  Mail, 
  Phone, 
  Camera 
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { validateFullName, validateEmail, validatePhone } from '../utils/validation';

const ProfileAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, updateProfile } = useProject();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(state.userName);
    const [email, setEmail] = useState(state.userEmail);
    const [phone, setPhone] = useState(state.userPhone);
    const [profileImage, setProfileImage] = useState(state.profileImage);
    const [error, setError] = useState('');

    const handleSave = () => {
        setError('');
        
        if (!validateFullName(name)) {
            setError('Full name should only contain letters and numbers');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address ending in .com');
            return;
        }
        if (!validatePhone(phone)) {
            setError('Phone number must start with 6,7,8,9 and be 10 digits');
            return;
        }

        updateProfile({ name, email, phone, profileImage });
        setIsEditing(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
                if (!isEditing) {
                    updateProfile({ name, email, phone, profileImage: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const EditableField = ({ label, value, setter, icon: Icon, isEditing }: any) => (
        <div className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-blue-600">
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                {isEditing ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full text-base font-semibold text-slate-800 bg-slate-50 rounded-lg px-2 py-1 outline-blue-500"
                    />
                ) : (
                    <p className="text-base font-semibold text-slate-800">{value || 'Not set'}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-white min-h-screen">
            {/* Top Bar */}
            <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-100">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-slate-900">Profile & Account</h1>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-2 -mr-2 rounded-full transition-colors ${isEditing ? 'text-red-500 hover:bg-red-50' : 'text-blue-900 hover:bg-slate-50'}`}
                >
                    {isEditing ? <X size={24} /> : <Edit size={24} />}
                </button>
            </div>

            <div className="max-w-xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold border border-red-100">
                        {error}
                    </div>
                )}
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-slate-300" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                            <Camera size={18} />
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                            />
                        </label>
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 text-blue-600 text-sm font-bold hover:underline"
                    >
                        Change Photo
                    </button>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                    <EditableField 
                        label="Full Name" 
                        value={name} 
                        setter={setName} 
                        icon={User} 
                        isEditing={isEditing} 
                    />
                    <EditableField 
                        label="Email Address" 
                        value={email} 
                        setter={setEmail} 
                        icon={Mail} 
                        isEditing={isEditing} 
                    />
                    <EditableField 
                        label="Phone Number" 
                        value={phone} 
                        setter={setPhone} 
                        icon={Phone} 
                        isEditing={isEditing} 
                    />
                </div>

                {isEditing && (
                    <button
                        onClick={handleSave}
                        className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
                    >
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileAccountPage;
