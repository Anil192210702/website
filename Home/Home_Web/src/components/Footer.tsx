import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import interfaceLogo from '../assets/interface_logo.jpeg';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'Home', path: '/' },
            { name: 'About App', path: '/about_app' },
            { name: 'My Projects', path: '/projects' },
            { name: 'Settings', path: '/settings' },
        ],
        services: [
            { name: 'Construction Budget', path: '/construction/location' },
            { name: 'Interior Budget', path: '/interior/location' },
            { name: 'EMI Calculator', path: '/emi' },
            { name: 'Total Project Cost', path: '/total-cost' },
        ],
        support: [
            { name: 'Contact Us', path: '/contact' },
            { name: 'Help & Support', path: '/help_support' },
            { name: 'Privacy & Security', path: '/privacy_security' },
        ]
    };

    const socialLinks = [
        { icon: <Instagram size={20} />, href: 'https://www.instagram.com/p/DF9A4EezMhP/', label: 'Instagram' },
        { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/anil-kumar-abbot-275143329/', label: 'Linkedin' },
        { icon: <MessageCircle size={20} />, href: 'https://wa.me/918978633246', label: 'WhatsApp' },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                                <img src={interfaceLogo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide">Home Builder Planner</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Empowering your home building journey with smart planning, accurate budgeting, and expert insights. Build your dream home with confidence.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-colors bg-gray-800 p-2 rounded-full"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-blue-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Services</h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-blue-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                <span className="text-sm">Saveetha school of engineering , <br />Thandalam,Chennai-602105,Tamilnadu</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-500 shrink-0" />
                                <span className="text-sm">8978633246</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-500 shrink-0" />
                                <span className="text-sm">crazyanil118@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © {currentYear} Home Builder Planner. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {footerLinks.support.map((link) => (
                            <Link key={link.path} to={link.path} className="text-xs hover:text-blue-400 transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
