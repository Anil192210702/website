import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import image1 from '../assets/interior/home2.webp';
import image3 from '../assets/interior/hall1.webp';
import image4 from '../assets/interior/buleprint.jpg';
import constructionImage from '../assets/interior/construction.jpg';
import interiorBudgetImage from '../assets/interior/home4.png';
import blueprintImage from '../assets/interior/buleprint.jpg';

const slides = [
    { image: image1, title: 'RESIDENTIAL', subtitle: 'spaces' },
    { image: image3, title: 'INTERIOR', subtitle: 'design' },
    { image: image4, title: 'BLUEPRINT', subtitle: 'planning' },
];

const HomePage = () => {
    const navigate = useNavigate();
    const { state } = useProject();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides.length);
    const prevImage = () => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);

    useEffect(() => {
        const interval = setInterval(nextImage, 5000); // Rotate every 5 seconds
        return () => clearInterval(interval);
    }, [currentImageIndex]);

    return (
        <div className="flex-1 bg-white w-full">
            {/* Main Hero Area */}
            <div className="relative w-full h-[90vh] bg-gray-900 overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={slide.image}
                            alt={`Home Planner Hero ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        {/* Overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-black/30"></div>

                        {/* Animated Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                            <h1
                                className={`text-4xl md:text-5xl lg:text-7xl font-medium tracking-[0.2em] md:tracking-[0.4em] text-white uppercase mb-2 md:mb-4 transition-all duration-1000 ease-out transform ${index === currentImageIndex ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                                    }`}
                            >
                                {slide.title}
                            </h1>
                            <span
                                className={`text-2xl md:text-3xl lg:text-4xl italic font-serif text-white transition-all duration-1000 delay-300 ease-out transform ${index === currentImageIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                            >
                                {slide.subtitle}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Left Arrow */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                >
                    <ChevronLeft size={32} />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                >
                    <ChevronRight size={32} />
                </button>

                {!state.isLoggedIn && (
                    <div className="absolute inset-x-0 bottom-0 pb-12 flex justify-center items-end">
                        {/* Bottom-aligned button in the center */}
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded shadow-lg transition-colors text-lg"
                        >
                            Start Cost Estimation
                        </button>
                    </div>
                )}
            </div>

            {/* 3-Column Text Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {/* Item 1 */}
                    <div className="flex flex-col items-center">
                        <div className="h-24 w-px bg-gray-400 mb-6 font-thin"></div>
                        <h2 className="text-xl md:text-2xl font-medium tracking-[0.2em] text-gray-900 uppercase mb-1">
                            Construction
                        </h2>
                        <span className="italic text-gray-600 font-serif mb-6 text-lg">planning</span>
                        <p className="text-gray-500 text-sm leading-relaxed text-justify md:text-center px-2">
                            Construction budgeting is the foundation of every successful home project. Our app helps users estimate structural costs based on area, floors, material quality, and location. It provides a clear breakdown of material and labor expenses to support better financial planning before starting construction.
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col items-center">
                        <div className="h-24 w-px bg-gray-400 mb-6 font-thin"></div>
                        <h2 className="text-xl md:text-2xl font-medium tracking-[0.2em] text-gray-900 uppercase mb-1">
                            Interior
                        </h2>
                        <span className="italic text-gray-600 font-serif mb-6 text-lg">design</span>
                        <p className="text-gray-500 text-sm leading-relaxed text-justify md:text-center px-2">
                            Interior planning helps transform a house into a comfortable and functional living space. HomeBuild Planner allows users to estimate interior costs by selecting room types, finishes, and design options. This helps users choose the best design that fits their style and budget.
                        </p>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col items-center">
                        <div className="h-24 w-px bg-gray-400 mb-6 font-thin"></div>
                        <h2 className="text-xl md:text-2xl font-medium tracking-[0.2em] text-gray-900 uppercase mb-1">
                            EMI Calculator
                        </h2>
                        <span className="italic text-gray-600 font-serif mb-6 text-lg">finance</span>
                        <p className="text-gray-500 text-sm leading-relaxed text-justify md:text-center px-2">
                            Financial planning is an essential part of building a home. The EMI calculator helps users estimate monthly loan payments based on loan amount, interest rate, and tenure. This allows homeowners to plan their finances wisely and manage construction expenses without financial stress.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Only Visible When Logged In */}
            {state.isLoggedIn && (
                <>
                    {/* Features Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">

                            {/* Construction Budget */}
                            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:col-span-3 gap-8">
                                <img
                                    src={constructionImage}
                                    alt="Construction Phase"
                                    className="w-full md:w-1/2 h-64 md:h-80 object-cover rounded-xl shadow-lg"
                                />
                                <div className="flex flex-col items-center md:items-start flex-1 mt-4 md:mt-8">
                                    <div className="h-12 w-px md:h-px md:w-16 bg-gray-300 mb-6"></div>
                                    <h2 className="text-2xl md:text-3xl font-medium tracking-widest text-gray-900 mb-2 uppercase">
                                        Construction Budget
                                    </h2>
                                    <span className="italic text-gray-600 mb-6 font-serif">Materials & Labor</span>
                                    <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-2xl">
                                        Estimate the complete construction cost of your house using accurate material and labor calculations. Our system analyzes building area, material requirements, and regional cost factors to provide a reliable construction budget before starting your project.
                                    </p>
                                </div>
                            </div>

                            {/* Interior Budget */}
                            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:col-span-3 gap-8 mt-12 md:mt-16">
                                <div className="flex flex-col items-center md:items-start flex-1 mt-4 md:mt-8 order-2 md:order-1">
                                    <div className="h-12 w-px md:h-px md:w-16 bg-gray-300 mb-6"></div>
                                    <h2 className="text-2xl md:text-3xl font-medium tracking-widest text-gray-900 mb-2 uppercase">
                                        Interior Budget
                                    </h2>
                                    <span className="italic text-gray-600 mb-6 font-serif">Decor & Furnishing</span>
                                    <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-2xl">
                                        Plan your interior design expenses efficiently. Calculate the cost of flooring, furniture, painting, lighting, and other interior elements to create a comfortable and stylish living space within your budget.
                                    </p>
                                </div>
                                <img
                                    src={blueprintImage}
                                    alt="Interior Phase"
                                    className="w-full md:w-1/2 h-64 md:h-80 object-cover rounded-xl shadow-lg order-1 md:order-2"
                                />
                            </div>

                            {/* Architecture & Planning */}
                            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:col-span-3 gap-8 mt-12 md:mt-16">
                                <img
                                    src={interiorBudgetImage}
                                    alt="Architecture & Planning"
                                    className="w-full md:w-1/2 h-64 md:h-80 object-cover rounded-xl shadow-lg"
                                />
                                <div className="flex flex-col items-center md:items-start flex-1 mt-4 md:mt-8">
                                    <div className="h-12 w-px md:h-px md:w-16 bg-gray-300 mb-6"></div>
                                    <h2 className="text-2xl md:text-3xl font-medium tracking-widest text-gray-900 mb-2 uppercase">
                                        Architecture & Planning
                                    </h2>
                                    <span className="italic text-gray-600 mb-6 font-serif">Design & Structural Integrity</span>
                                    <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-2xl">
                                        Bring your vision to life with expert architectural planning. Review comprehensive residential blueprints, visualize floor layouts, assess structural flow, and ensure your home design fulfills both aesthetic dreams and practical engineering requirements before the first brick is laid.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;
