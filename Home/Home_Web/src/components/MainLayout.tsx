import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, Folder, MessageSquare } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import LoginPromptModal from './LoginPromptModal';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, logout } = useProject();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Construction Budget', path: '/construction/location', protected: true },
        { name: 'Interior Budget', path: '/interior/location', protected: true },
        { name: 'EMI Calculator', path: '/emi', protected: true },
        { name: 'Total Project Cost', path: '/total-cost', protected: true },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
        if (link.protected && !state.isLoggedIn) {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            setShowLoginPrompt(true);
        } else {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Top Navigation Bar */}
            <header className="bg-gray-900 px-4 py-4 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo Area */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">
                            HP
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-wide">Home Builder Planner</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`text-sm font-medium transition-colors hover:text-orange-400 ${isActive(link.path) ? 'text-orange-500' : 'text-gray-300'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Auth Status / Profile Menu */}
                        {state.isLoggedIn ? (
                            <div className="relative ml-4 border-l border-gray-700 pl-4" ref={menuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                                    title="Profile Menu"
                                >
                                    <Menu size={24} />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 border border-gray-100">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-sm font-semibold text-gray-900 truncate">Hello, {state.userName}</p>
                                        </div>

                                        <Link to="/settings" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <Settings size={18} /> Settings
                                        </Link>
                                        <Link to="/projects" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <Folder size={18} /> Projects
                                        </Link>
                                        <Link to="/contact" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors mb-1">
                                            <MessageSquare size={18} /> Contact Us
                                        </Link>

                                        <div className="border-t border-gray-100 mt-1">
                                            <button
                                                onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut size={18} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {!state.isLoggedIn && (
                            <Link
                                to="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
                            >
                                Login
                            </Link>
                        )}
                        <button
                            className="text-gray-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t border-gray-700 pt-4">
                        {state.isLoggedIn && (
                            <div className="flex items-center gap-2 text-gray-300 pb-2 border-b border-gray-800">
                                <User size={18} />
                                <span className="text-sm font-medium">Hello, {state.userName}</span>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`text-base font-medium transition-colors hover:text-orange-400 ${isActive(link.path) ? 'text-orange-500' : 'text-gray-300'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {state.isLoggedIn && (
                            <>
                                <div className="h-px bg-gray-800 my-2"></div>
                                <Link
                                    to="/settings"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-base font-medium transition-colors text-gray-300 hover:text-white"
                                >
                                    <Settings size={20} /> Settings
                                </Link>
                                <Link
                                    to="/projects"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-base font-medium transition-colors text-gray-300 hover:text-white"
                                >
                                    <Folder size={20} /> Projects
                                </Link>
                                <Link
                                    to="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-base font-medium transition-colors text-gray-300 hover:text-white mb-2"
                                >
                                    <MessageSquare size={20} /> Contact Us
                                </Link>

                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 text-red-400 hover:text-red-300 pt-3 border-t border-gray-800 text-left font-medium text-base"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </nav>
                )}
            </header>

            {/* Login Prompt Modal */}
            <LoginPromptModal
                isOpen={showLoginPrompt}
                onClose={() => setShowLoginPrompt(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
