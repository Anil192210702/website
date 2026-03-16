import React, { useEffect, useState } from 'react';
import { generateConstructionReport } from '../utils/PdfGenerator';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Download, ArrowLeft, Grid, Wrench, Layers, Plus } from 'lucide-react';
import { constructionApi } from '../services/api';


interface MaterialCost {
    name: string;
    cost: number;
}

const ConstructionCostEstimate = () => {
    const { state, updateConstruction, saveProject } = useProject();
    const navigate = useNavigate();
    const { packageType } = useParams<{ packageType: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [breakdown, setBreakdown] = useState<MaterialCost[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchEstimate = async () => {
            try {
                setLoading(true);
                
                const pkgType = (packageType || state.construction.packageType || 'basic').toLowerCase();
                
                console.log('Fetching estimate with dynamic data:', {
                    userId: state.userId,
                    state: state.construction.state,
                    location: state.construction.location,
                    area: state.construction.area,
                    package: pkgType
                });
                
                // 1. Create Project
                const createRes = await constructionApi.createProject({
                    user: state.userId || 1, // Use dynamic user ID or fallback to 1
                    state: state.construction.state || 'Tamil Nadu',
                    city: state.construction.location || 'Chennai',
                    land_area: state.construction.area || 1000,
                    built_up_area: state.construction.area || 1000,
                    unit: state.construction.unit === 'Sq. Feet' ? 'sqft' : 'sqm',
                    floors: state.construction.floors === 'Ground' ? 0 : 
                            (state.construction.floors === 'G + 1' || state.construction.floors === 'Ground + 1') ? 1 : 2,
                    package: pkgType
                });

                console.log('Project created:', createRes.data);
                const projectId = createRes.data.project_id;

                // 2. Calculate Base Budget
                const calcRes = await constructionApi.calculateBase(projectId);
                console.log('Calculation response:', calcRes.data);

                // Map the backend breakdown object to the frontend's expected format
                const rawBreakdown = calcRes.data.breakdown;
                const mappedBreakdown: MaterialCost[] = Object.entries(rawBreakdown).map(([name, data]: [string, any]) => ({
                    name: name,
                    cost: data.cost
                }));

                setBreakdown(mappedBreakdown);
                setTotal(calcRes.data.base_total_cost);
                updateConstruction({ totalCost: calcRes.data.base_total_cost });
            } catch (err: any) {
                console.error('Estimate Fetch Error:', err);
                console.log('Error Response Data:', err.response?.data);
                
                const serverError = err.response?.data?.error || err.response?.data?.message;
                const statusText = err.response?.status ? `(Status: ${err.response.status})` : '';
                
                let errorMessage = serverError 
                    ? `${serverError} ${statusText}`
                    : (err.response?.status ? `Server Error ${statusText}` : 'Network Error: Please check your connection or backend status.');
                
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchEstimate();
    }, [packageType, state.construction.area, state.construction.packageType, state.construction.floors, state.construction.location, state.construction.state]);

    const handleDownloadReport = () => {
        if (breakdown.length > 0) {
            // Map breakdown back to the format expected by PdfGenerator
            const formattedBreakdown: Record<string, any> = {};
            breakdown.forEach(item => {
                formattedBreakdown[item.name] = { 
                    cost: item.cost,
                    quantity: 'Estimated', // Frontend doesn't have exact quantity here
                    unit: '' 
                };
            });
            
            generateConstructionReport(
                { totalOptimizedCost: total, breakdown: formattedBreakdown },
                state.construction.area || 0,
                state.construction.unit || 'Sq. Feet'
            );
        } else {
            alert('No report data available to download.');
        }
    };

    const handleAddToCart = () => {
        updateConstruction({ inCart: true });
        navigate('/total-cost');
    };

    const handleSaveProject = () => {
        saveProject({
            type: 'CONSTRUCTION',
            state: state.construction.state || 'Tamil Nadu',
            city: state.construction.location || 'Chennai',
            packageName: state.construction.packageType,
            totalCost: total,
            constructionData: state.construction
        });
        alert('Project saved successfully!');
    };

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-7xl mx-auto relative px-6">
            <div className="flex items-center justify-between py-4 mb-2">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-black" />
                </button>
                <h1 className="text-lg font-bold text-[#1F2937]">Cost Estimate</h1>
                <div className="flex gap-2">
                    <button onClick={handleDownloadReport} className="p-2">
                        <Download size={24} className="text-black" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="text-blue-600 font-medium">Retry</button>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
                        {/* Total Project Estimate Card */}
                        <div className="bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] rounded-[24px] p-6 text-white shadow-xl mb-6 relative overflow-hidden">
                            <p className="text-sm text-white/90 mb-1">Total Project Estimate</p>
                            <h3 className="text-4xl font-extrabold mb-4 pb-4 border-b border-white/20">₹ {total.toLocaleString('en-IN')}</h3>

                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-white/70 text-xs">Total Built-up Area</p>
                                    <p className="text-white font-bold text-base">{state.construction.area} {state.construction.unit}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/70 text-xs">Cost per Sq. Ft.</p>
                                    <p className="text-white font-bold text-base">₹{Math.round(total / state.construction.area).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        <h4 className="font-bold text-[#1F2937] text-lg mb-4">Material Breakdown</h4>

                        <div className="grid grid-cols-2 gap-3">
                            {breakdown.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center text-center p-4 bg-white border border-[#F1F5F9] shadow-sm rounded-2xl">
                                    <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center shrink-0 mb-3 mx-auto">
                                        {item.name.toLowerCase().includes('cement') ? <Grid size={22} className="text-[#2563EB]" /> :
                                            item.name.toLowerCase().includes('steel') ? <Wrench size={22} className="text-[#2563EB]" /> :
                                                item.name.toLowerCase().includes('brick') ? <Layers size={22} className="text-[#2563EB]" /> :
                                                    <Plus size={22} className="text-[#2563EB]" />}
                                    </div>
                                    <div className="flex-1 mb-2">
                                        <h4 className="font-bold text-[13px] text-[#1E293B] leading-tight mb-1">{item.name.replace("_", " ").toUpperCase()}</h4>
                                        <p className="text-[11px] text-[#64748B]">Estimated quantity</p>
                                    </div>
                                    <div className="font-bold text-[15px] text-[#1E3A8A]">
                                        ₹{item.cost.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-white p-6 flex gap-4 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 h-[56px] rounded-xl border border-[#E2E8F0] text-[#475569] font-bold text-sm bg-white hover:bg-gray-50 transition-colors uppercase"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="flex-[1.3] h-[56px] rounded-full bg-[#2962FF] text-white font-bold text-[18px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            <Plus size={24} /> ADD To Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConstructionCostEstimate;
