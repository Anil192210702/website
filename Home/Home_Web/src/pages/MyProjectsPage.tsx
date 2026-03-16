import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import axios from 'axios';
import { Folder, Eye, Trash2, ArrowLeft, Plus } from 'lucide-react';

interface SavedProject {
    id: string;
    type: 'CONSTRUCTION' | 'INTERIOR';
    packageName: string;
    totalCost: number;
    state: string;
    city: string;
    created_at: string;
}

const MyProjectsPage = () => {
    console.log('Rendering MyProjectsPage');
    const navigate = useNavigate();
    const { state, getProjects, deleteProject, loadProject } = useProject();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = () => {
            setLoading(true);
            try {
                const userProjects = getProjects();
                setProjects(userProjects);
            } catch (err) {
                console.error('Error loading projects:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        if (state.isLoggedIn) {
            loadProjects();
        } else {
            navigate('/login');
        }
    }, [state.isLoggedIn, getProjects, navigate]);

    const handleDelete = (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('Failed to delete project');
        }
    };

    const handleViewProject = (id: string) => {
        loadProject(id);
        const project = projects.find(p => p.id === id);
        if (project) {
            if (project.type === 'CONSTRUCTION') {
                navigate(`/construction/cost-estimate/${project.packageName ? project.packageName.toLowerCase() : 'basic'}`);
            } else if (project.type === 'INTERIOR') {
                navigate(`/interior/total-cost/${project.packageName || 'Basic'}`);
            } else {
                navigate('/total-cost');
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto w-full px-6 pt-10">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-sans">My Projects</h1>
                        <p className="text-gray-500 mt-1">Manage your construction & interior cost reports</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading your projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Folder size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No projects saved yet</h3>
                        <p className="text-gray-500 max-w-sm mb-8">Start by estimating construction or interior costs and save them to your profile.</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                        >
                            Create New Project
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider ${
                                        project.packageName?.toLowerCase() === 'luxury' ? 'bg-[#FFD1DC] text-[#D81B60]' :
                                        project.packageName?.toLowerCase() === 'premium' ? 'bg-[#E0F2F1] text-[#00796B]' :
                                        'bg-[#E8EAF6] text-[#3F51B5]'
                                    }`}>
                                        {project.packageName || 'BASIC'}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-slate-900">{formatCurrency(project.totalCost)}</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                    {project.type === 'CONSTRUCTION' ? 'Construction Cost' : 
                                     project.type === 'INTERIOR' ? 'Interior Cost' : 'Total Project Cost'}
                                </h3>

                                <div className="flex gap-4 mb-6">
                                    <div className="text-[13px] text-slate-500 font-medium">
                                        <span className="text-slate-400">State:</span> {project.state}
                                    </div>
                                    <div className="text-[13px] text-slate-500 font-medium">
                                        <span className="text-slate-400">City:</span> {project.city}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-50 mb-4"></div>

                                <div className="flex justify-between items-center px-1">
                                    <button 
                                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors"
                                        onClick={() => handleViewProject(project.id)}
                                    >
                                        <Eye size={18} className="text-slate-400" />
                                        <span>View</span>
                                    </button>
                                    <button 
                                        className="flex items-center gap-2 text-rose-500 hover:text-rose-700 font-bold text-sm transition-colors"
                                        onClick={() => handleDelete(project.id)}
                                    >
                                        <Trash2 size={18} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProjectsPage;
