import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, Clock, Linkedin, Instagram, ArrowRight } from 'lucide-react';

const ContactOption = ({ title, subtitle, icon: Icon, onClick, color }: any) => (
    <div 
        onClick={onClick}
        className="bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-blue-100"
    >
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Icon size={24} className="text-blue-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
        <p className={`text-[11px] ${title.includes('Call') ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{subtitle}</p>
    </div>
);

const ContactUsPage = () => {
    console.log('Rendering ContactUsPage');
    const navigate = useNavigate();

    const contactOptions = [
        {
            title: 'Call Support',
            subtitle: '+91 8978633246',
            icon: Phone,
            onClick: () => window.open('tel:+918978633246')
        },
        {
            title: 'Email Support',
            subtitle: 'support@homeplanner.ai',
            icon: Mail,
            onClick: () => window.open('mailto:support@homeplanner.ai')
        },
        {
            title: 'Live Chat',
            subtitle: 'Available 24/7',
            icon: MessageCircle,
            onClick: () => alert('Live Chat starting soon!')
        },
        {
            title: 'Visit Office',
            subtitle: 'View Map',
            icon: MapPin,
            onClick: () => window.open('https://maps.google.com/?q=SIMATS+University,+Saveetha+Nagar,+Thandalam,+Chennai+-+602105')
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white pb-20">
            <div className="max-w-4xl mx-auto w-full px-6 pt-10">
                <div className="flex items-center mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="ml-4 text-xl font-bold text-gray-900">Contact Us</h1>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-[28px] leading-tight font-extrabold text-[#0F172A] mb-4">
                        We're here to support your<br />construction journey
                    </h2>
                    <p className="text-gray-500 text-base max-w-sm mx-auto">
                        Get in touch with our expert team for quick assistance.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-16">
                    {contactOptions.map((option, idx) => (
                        <ContactOption key={idx} {...option} />
                    ))}
                </div>

                <div className="bg-[#F8FAFC] rounded-[32px] p-8 text-center border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">HomePlanner HQ</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        SIMATS University, Saveetha Nagar, Thandalam<br />
                        Chennai - 602105
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Clock size={18} className="text-blue-600" />
                        <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                    </div>
                </div>

                <div className="mt-16 flex justify-center gap-12">
                    <div className="flex flex-col items-center gap-2 cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <Linkedin size={20} className="text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">LinkedIn</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                            <Instagram size={20} className="text-gray-600 group-hover:text-pink-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Instagram</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
