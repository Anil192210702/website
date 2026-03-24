import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import axios from 'axios';
import { Download, Save, XCircle, CheckCircle2 } from 'lucide-react';
import { generateConstructionReport, generateInteriorReport } from '../utils/PdfGenerator';

const TotalProjectCostPage = () => {
    const { state, updateConstruction, updateInterior, resetProject, saveProject } = useProject();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    
    // Selection states for save/remove/download
    const [isConstructionSelected, setIsConstructionSelected] = useState(state.construction.inCart);
    const [isInteriorSelected, setIsInteriorSelected] = useState(state.interior.inCart);

    const constructionTotal = state.construction.inCart ? state.construction.totalCost : 0;
    const interiorTotal = state.interior.inCart ? state.interior.totalCost : 0;
    const grandTotal = constructionTotal + interiorTotal;

    const anyItemSelected = isConstructionSelected || isInteriorSelected;

    const handleSaveProject = async () => {
        if (!anyItemSelected) {
            alert('Please select at least one item to save.');
            return;
        }
        setIsSaving(true);
        setSaveMessage('');
        try {
            if (isConstructionSelected) {
                const projId = state.construction.finalResponse?.projectId || state.construction.finalResponse?.id;
                saveProject({
                    type: 'CONSTRUCTION',
                    state: state.construction.state,
                    city: state.construction.location,
                    packageName: state.construction.packageType,
                    totalCost: constructionTotal,
                    constructionData: state.construction
                }, projId ? `backend_c_${projId}` : undefined);
            }

            if (isInteriorSelected) {
                // Interior doesn't have a backend project ID yet, so we use a deterministic but local-feeling ID
                // Or just let it use UUID for now until backend supports interior projects fully
                saveProject({
                    type: 'INTERIOR',
                    state: state.interior.state,
                    city: state.interior.location,
                    packageName: state.interior.packageType,
                    totalCost: interiorTotal,
                    interiorData: state.interior
                });
            }
            setSaveMessage('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            setSaveMessage('Failed to save project.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveSelected = () => {
        if (isConstructionSelected) updateConstruction({ inCart: false });
        if (isInteriorSelected) updateInterior({ inCart: false });
        setIsConstructionSelected(false);
        setIsInteriorSelected(false);
    };

    const handleDownloadReport = async () => {
        if (!anyItemSelected) {
            alert('Please select at least one item to download.');
            return;
        }
        
        if (isConstructionSelected) {
            // Map breakdown to format expected by PdfGenerator
            const formattedBreakdown: Record<string, any> = {};
            const rawBreakdown = state.construction.finalResponse?.breakdown || {};
            
            // If we don't have breakdown in state, it might be in totalCost only
            // But usually ConstructionCostEstimate.tsx saves it in the context
            
            const getFloorCount = (floorStr: string) => {
                if (!floorStr || floorStr === 'Ground') return 0;
                const match = floorStr.match(/\d+/);
                return match ? parseInt(match[0]) : 1;
            };
            const totalArea = state.construction.area * (getFloorCount(state.construction.floors) + 1);

            generateConstructionReport(
                { 
                    totalOptimizedCost: state.construction.totalCost, 
                    breakdown: state.construction.finalResponse?.breakdown || {} 
                },
                totalArea,
                state.construction.unit || 'Sq. Feet'
            );
        }

        if (isInteriorSelected && state.interior.calculationResult) {
            generateInteriorReport(
                state.interior.calculationResult,
                state.interior.packageType || 'Interior'
            );
        }
    };

    const formatPrice = (price: number) => {
        return `₹ ${price.toLocaleString('en-IN')}`;
    };

    return (
        <div className="p-6 w-full max-w-5xl mx-auto min-h-screen flex flex-col bg-gray-50/30">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Total Project Cost</h1>
                    <p className="text-slate-400 mt-1 font-medium">Project estimation summary</p>
                </div>
                <button onClick={handleDownloadReport} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Download size={24} className="text-slate-900" />
                </button>
            </div>

            {/* Total Cost Card - Large & Vibrant */}
            <div className="bg-gradient-to-r from-emerald-400 to-blue-500 rounded-[32px] p-10 text-white shadow-xl shadow-blue-100/50 mb-8 flex flex-col items-center">
                <p className="text-lg opacity-90 font-medium mb-3">Total Estimated Cost</p>
                <h2 className="text-5xl font-black tracking-tight">{formatPrice(grandTotal)}</h2>
            </div>

            {/* Details Card with Selection */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm mb-10">
                <div className="space-y-6">
                    {/* Construction Cost Selection */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => state.construction.inCart && setIsConstructionSelected(!isConstructionSelected)}
                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isConstructionSelected 
                                        ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100' 
                                        : 'border-slate-300'
                                } ${!state.construction.inCart && 'opacity-30 cursor-not-allowed'}`}
                                disabled={!state.construction.inCart}
                            >
                                {isConstructionSelected && <CheckCircle2 size={18} className="text-white" />}
                            </button>
                            <span className={`text-lg font-semibold ${state.construction.inCart ? 'text-slate-700' : 'text-slate-300 italic'}`}>
                                Construction Cost
                            </span>
                        </div>
                        <span className={`text-lg font-bold ${state.construction.inCart ? 'text-slate-900' : 'text-slate-300'}`}>
                            {formatPrice(constructionTotal)}
                        </span>
                    </div>

                    <div className="h-px bg-slate-50"></div>

                    {/* Interior Cost Selection */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => state.interior.inCart && setIsInteriorSelected(!isInteriorSelected)}
                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isInteriorSelected 
                                        ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100' 
                                        : 'border-slate-300'
                                } ${!state.interior.inCart && 'opacity-30 cursor-not-allowed'}`}
                                disabled={!state.interior.inCart}
                            >
                                {isInteriorSelected && <CheckCircle2 size={18} className="text-white" />}
                            </button>
                            <span className={`text-lg font-semibold ${state.interior.inCart ? 'text-slate-700' : 'text-slate-300 italic'}`}>
                                Interior Cost
                            </span>
                        </div>
                        <span className={`text-lg font-bold ${state.interior.inCart ? 'text-slate-900' : 'text-slate-300'}`}>
                            {formatPrice(interiorTotal)}
                        </span>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-slate-950">Grand Total</span>
                        <span className="text-2xl font-black text-slate-950">{formatPrice(grandTotal)}</span>
                    </div>
                </div>
            </div>

            {saveMessage && (
                <div className={`p-4 rounded-2xl mb-6 text-sm font-semibold flex items-center gap-2 ${
                    saveMessage.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                    <CheckCircle2 size={18} /> {saveMessage}
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 mt-auto pb-6">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleRemoveSelected}
                        disabled={!anyItemSelected}
                        className={`py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                            anyItemSelected 
                                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100/50' 
                                : 'bg-rose-200 cursor-not-allowed'
                        }`}
                    >
                        Remove
                    </button>

                    <button
                        onClick={resetProject}
                        className="py-4 rounded-2xl border-2 border-blue-400 text-blue-500 bg-white font-bold hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        Clear All
                    </button>
                </div>

                <button
                    onClick={handleSaveProject}
                    disabled={isSaving}
                    className={`w-full py-5 rounded-[20px] font-bold text-white text-lg transition-all shadow-xl shadow-blue-200 ${
                        isSaving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isSaving ? 'Saving...' : 'Save Project'}
                </button>

                <button
                    onClick={handleDownloadReport}
                    className="w-full py-4 rounded-[20px] border-2 border-slate-200 text-slate-700 bg-white font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    <Download size={20} className="text-blue-600" />
                    Download Report (PDF)
                </button>
            </div>
        </div>
    );
};

export default TotalProjectCostPage;
