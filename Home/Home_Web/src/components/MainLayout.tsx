import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, Folder, MessageSquare } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import LoginPromptModal from './LoginPromptModal';
import Footer from './Footer';
import interfaceLogo from '../assets/interface_logo.jpeg';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, logout } = useProject();

    const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
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
            {!isAuthPage && (
                <header className="bg-gray-900 px-4 py-4 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo Area */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                            <img src={interfaceLogo} alt="Logo" className="w-full h-full object-contain" />
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
                                className={`text-sm font-medium transition-colors hover:text-blue-400 ${isActive(link.path) ? 'text-blue-500' : 'text-gray-300'
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
                                    {state.profileImage ? (
                                        <div className="w-9 h-9 rounded-full border-2 border-blue-500/30 p-0.5 group-hover:border-blue-500 transition-all overflow-hidden bg-gray-800">
                                            <img 
                                                src={state.profileImage} 
                                                alt="Profile" 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <Menu size={24} />
                                    )}
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100 mb-1 flex items-center gap-3">
                                            {state.profileImage ? (
                                                <img 
                                                    src={state.profileImage} 
                                                    alt="Avatar" 
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                                    <User size={20} />
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">Hello, {state.userName}</p>
                                                <p className="text-[11px] text-gray-500 truncate">{state.userEmail}</p>
                                            </div>
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
                                                onClick={() => { logout(); setIsProfileMenuOpen(false); navigate('/'); }}
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
                            <div className="flex items-center gap-3 text-gray-300 pb-3 mb-2 border-b border-gray-800/50">
                                {state.profileImage ? (
                                    <img 
                                        src={state.profileImage} 
                                        alt="Profile" 
                                        className="w-10 h-10 rounded-full object-cover border border-gray-700"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                        <User size={20} />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">Hello, {state.userName}</span>
                                    <span className="text-[11px] text-gray-400">{state.userEmail}</span>
                                </div>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`text-base font-medium transition-colors hover:text-blue-400 ${isActive(link.path) ? 'text-blue-500' : 'text-gray-300'
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
                                        navigate('/');
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
            )}

            {/* Login Prompt Modal */}
            <LoginPromptModal
                isOpen={showLoginPrompt}
                onClose={() => setShowLoginPrompt(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            {/* Footer - Only visible after login and not on auth pages */}
            {!isAuthPage && state.isLoggedIn && <Footer />}
        </div>
    );
};

export default MainLayout;
