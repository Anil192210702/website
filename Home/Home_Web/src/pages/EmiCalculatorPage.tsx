import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

interface EmiSchedule {
    year: number;
    totalPaid: number;
    principalPaid: number;
    interestPaid: number;
    balanceRemaining: number;
    completionPercentage: number;
}

const EmiCalculatorPage = () => {
    const [loanAmount, setLoanAmount] = useState<number>(3200000);
    const [interestRate, setInterestRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(20);
    const [isMonths, setIsMonths] = useState<boolean>(false);

    const [emi, setEmi] = useState<number>(0);
    const [schedule, setSchedule] = useState<EmiSchedule[]>([]);
    const [expandedYear, setExpandedYear] = useState<number | null>(null);

    useEffect(() => {
        const fetchEmi = async () => {
            try {
                const tenureMonths = isMonths ? tenure : tenure * 12;
                const res = await axios.post('http://localhost:4000/api/emi', {
                    principal: loanAmount,
                    annualRate: interestRate,
                    tenureMonths
                });

                setEmi(res.data.emi);
                setSchedule(res.data.scheduleByYear);
            } catch (err) {
                console.error('EMI computation failed', err);
            }
        };

        fetchEmi();
    }, [loanAmount, interestRate, tenure, isMonths]);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Top Black Card Section */}
            <div className="bg-[#111] text-white p-6 pb-8 rounded-b-3xl shadow-xl relative z-10">
                <h2 className="text-xl font-bold mb-8">EMI Calculator</h2>

                <div className="space-y-6">
                    {/* Loan Amount Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-400 text-sm">Loan Amount</label>
                            <div className="font-semibold text-lg text-green-400 border border-green-500/30 px-3 py-1 rounded-lg bg-green-950/30">
                                ₹ {loanAmount.toLocaleString('en-IN')}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0" max="10000000" step="100000"
                            value={loanAmount}
                            onChange={e => setLoanAmount(Number(e.target.value))}
                            className="w-full accent-green-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Interest Rate Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-400 text-sm">Interest Rate</label>
                            <div className="font-semibold text-lg text-purple-400 border border-purple-500/30 px-3 py-1 rounded-lg bg-purple-950/30">
                                {interestRate.toFixed(1)} %
                            </div>
                        </div>
                        <input
                            type="range"
                            min="5" max="20" step="0.1"
                            value={interestRate}
                            onChange={e => setInterestRate(Number(e.target.value))}
                            className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Tenure Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-400 text-sm">Tenure</label>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-gray-800 rounded-lg p-1 text-xs">
                                    <button
                                        onClick={() => setIsMonths(false)}
                                        className={`px-3 py-1 rounded-md transition ${!isMonths ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
                                    >Yr</button>
                                    <button
                                        onClick={() => setIsMonths(true)}
                                        className={`px-3 py-1 rounded-md transition ${isMonths ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
                                    >Mo</button>
                                </div>
                                <div className="font-semibold text-lg text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg bg-blue-950/30">
                                    {tenure} {isMonths ? 'm' : 'y'}
                                </div>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={1} max={isMonths ? 360 : 30} step={1}
                            value={tenure}
                            onChange={e => setTenure(Number(e.target.value))}
                            className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mt-10 mb-2">
                    <p className="text-gray-400 text-sm uppercase tracking-wide">Estimated Monthly EMI</p>
                    <div className="text-4xl font-bold mt-1 tracking-tight">₹ {emi.toLocaleString('en-IN')}</div>
                </div>
            </div>

            {/* Schedule Accordion */}
            <div className="flex-1 overflow-y-auto p-4 w-full max-w-7xl mx-auto w-full pb-28 hide-scrollbar">
                <h3 className="font-bold text-gray-800 mb-4 px-1">Amortization Schedule</h3>

                <div className="space-y-3">
                    {schedule.map((s) => (
                        <div key={s.year} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                            <div
                                onClick={() => setExpandedYear(expandedYear === s.year ? null : s.year)}
                                className="p-4 flex justify-between items-center cursor-pointer select-none"
                            >
                                <div>
                                    <h4 className="font-semibold text-gray-800">{s.year}</h4>
                                    <p className="text-xs text-gray-500 mt-1">Total Paid: ₹ {s.totalPaid.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">{s.completionPercentage}% Paid</span>
                                    {expandedYear === s.year ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </div>
                            </div>

                            {expandedYear === s.year && (
                                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-y-3 gap-x-4 pt-3 text-sm">
                                    <div>
                                        <span className="text-gray-500 text-xs block">Principal Paid</span>
                                        <span className="font-medium text-gray-800">₹ {s.principalPaid.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs block">Interest Paid</span>
                                        <span className="font-medium text-gray-800">₹ {s.interestPaid.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-500 text-xs block">Balance Remaining</span>
                                        <span className="font-bold text-red-500">₹ {s.balanceRemaining.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 w-full max-w-7xl mx-auto p-4 bg-gradient-to-t from-white via-white to-transparent z-20 pointer-events-none">
                <div className="flex gap-3 pointer-events-auto">
                    <button className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-xl shadow-gray-200">
                        <Download size={22} /> Download PDF Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmiCalculatorPage;
