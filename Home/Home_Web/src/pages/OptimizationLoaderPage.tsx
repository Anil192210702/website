import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Home, Loader2, Check } from 'lucide-react';

const OptimizationLoaderPage = () => {
    const navigate = useNavigate();
    const { state } = useProject();
    const { packageType } = useParams<{ packageType: string }>();

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Analyzing live construction material prices');
    const [materialsAnalyzed, setMaterialsAnalyzed] = useState(false);
    const [floorPlanIngested, setFloorPlanIngested] = useState(false);

    useEffect(() => {
        const flow = async () => {
            // Simulate steps matching Android
            await new Promise(r => setTimeout(r, 1000));
            setFloorPlanIngested(true);
            setProgress(20);

            const materials = ["Cement", "Steel", "Bricks", "Aggregate", "Sand", "Tiles", "Paint"];
            for (let i = 0; i < materials.length; i++) {
                setStatus(`Checking market rates for ${materials[i]}...`);
                await new Promise(r => setTimeout(r, 600));
                setProgress(20 + ((i + 1) / materials.length) * 60);
            }

            setMaterialsAnalyzed(true);
            setStatus("Optimization complete!");
            setProgress(90);

            await new Promise(r => setTimeout(r, 1000));
            setStatus("Finalizing your budget...");
            setProgress(100);

            await new Promise(r => setTimeout(r, 800));
            navigate(`/construction/optimization-results/${packageType || 'basic'}`);
        };

        flow();
    }, [navigate, packageType]);

    return (
        <div className="flex flex-col h-full bg-[#0D1B2A] w-full max-w-7xl mx-auto p-6 justify-center items-center text-center">

            <div className="relative flex justify-center items-center w-48 h-48 mb-12">
                {/* Circular animated border */}
                <div className="absolute inset-0 rounded-full border-4 border-[#00B4D8] border-t-transparent animate-spin opacity-50"></div>
                <div className="absolute inset-2 rounded-full border-4 border-[#00B4D8] border-b-transparent animate-spin-slow opacity-20"></div>

                <div className="w-32 h-32 bg-[#00B4D8]/10 rounded-full flex items-center justify-center">
                    <Home size={60} className="text-[#00B4D8]" />
                </div>
            </div>

            <h2 className="text-white text-2xl font-bold">AI is optimizing your</h2>
            <h2 className="text-[#00B4D8] text-2xl font-bold mb-8">
                {state.construction.area} {state.construction.unit} budget...
            </h2>

            {/* Progress Bar */}
            <div className="w-4/5 h-1.5 bg-white/10 rounded-full overflow-hidden mb-16">
                <div
                    className="h-full bg-[#00B4D8] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Status Card */}
            <div className="w-full bg-white/5 rounded-2xl p-4 flex flex-col items-start">
                <div className="flex items-center gap-3 mb-4">
                    <Loader2 size={16} className="text-[#00B4D8] animate-spin" />
                    <span className="text-[#00B4D8] text-sm">{status}</span>
                </div>

                <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-4 flex justify-center">
                            {materialsAnalyzed ? <Check size={14} className="text-[#00B4D8]" /> : null}
                        </div>
                        <span className={`text-sm ${materialsAnalyzed ? 'text-white/70' : 'text-white/30'}`}>Materials analyzed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 flex justify-center">
                            {floorPlanIngested ? <Check size={14} className="text-[#00B4D8]" /> : null}
                        </div>
                        <span className={`text-sm ${floorPlanIngested ? 'text-white/70' : 'text-white/30'}`}>Floor plan ingested</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OptimizationLoaderPage;
