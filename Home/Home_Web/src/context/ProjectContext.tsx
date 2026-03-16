import React, { createContext, useContext, useState, useEffect } from 'react';

type ProjectState = {
    isLoggedIn: boolean;
    userName: string;
    userEmail: string;
    userPhone: string;
    userId: string | null;
    profileImage: string | null;
    construction: {
        packageType: string;
        location: string;
        state: string;
        area: number;
        unit: string;
        floors: string;
        optimizationSavings: number;
        totalCost: number;
        inCart: boolean;
    };
    interior: {
        packageType: string;
        state: string;
        location: string;
        rooms: string[];
        roomConfigs: Record<string, any[]>;
        totalCost: number;
        inCart: boolean;
    };
};

export interface SavedProject {
    id: string;
    type: 'CONSTRUCTION' | 'INTERIOR' | 'TOTAL';
    date: number;
    state: string;
    city: string;
    packageName: string;
    totalCost: number;
    constructionTotal?: number;
    interiorTotal?: number;
    userName: string;
    // Optional state snapshots
    constructionData?: ProjectState['construction'];
    interiorData?: ProjectState['interior'];
}

type ProjectContextType = {
    state: ProjectState;
    updateConstruction: (data: Partial<ProjectState['construction']>) => void;
    updateInterior: (data: Partial<ProjectState['interior']>) => void;
    setUserName: (name: string) => void;
    updateProfile: (data: { name: string; email: string; phone: string; userId?: string | null; profileImage?: string | null }) => void;
    logout: () => void;
    resetProject: () => void;
    saveProject: (project: Omit<SavedProject, 'id' | 'date' | 'userName'>) => void;
    getProjects: () => SavedProject[];
    deleteProject: (id: string) => void;
    loadProject: (id: string) => void;
};

const initialState: ProjectState = {
    isLoggedIn: false,
    userName: '',
    userEmail: '',
    userPhone: '',
    userId: null,
    profileImage: null,
    construction: {
        packageType: 'Basic',
        location: '',
        state: '',
        area: 1000,
        unit: 'Sq. Feet',
        floors: 'Ground',
        optimizationSavings: 0,
        totalCost: 0,
        inCart: false,
    },
    interior: {
        packageType: 'Basic',
        state: '',
        location: '',
        rooms: [],
        roomConfigs: {},
        totalCost: 0,
        inCart: false,
    },
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ProjectState>(() => {
        const saved = localStorage.getItem('project_state');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved state:', e);
            }
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('project_state', JSON.stringify(state));
    }, [state]);

    const updateConstruction = (data: Partial<ProjectState['construction']>) => {
        setState(prev => ({ ...prev, construction: { ...prev.construction, ...data } }));
    };

    const updateInterior = (data: Partial<ProjectState['interior']>) => {
        setState(prev => ({ ...prev, interior: { ...prev.interior, ...data } }));
    };

    const setUserName = (name: string) => {
        setState(prev => ({ ...prev, userName: name, isLoggedIn: true }));
    };

    const updateProfile = (data: { name: string; email: string; phone: string; userId?: string | null; profileImage?: string | null }) => {
        setState(prev => ({ 
            ...prev, 
            userName: data.name, 
            userEmail: data.email, 
            userPhone: data.phone,
            userId: data.userId !== undefined ? data.userId : prev.userId,
            profileImage: data.profileImage !== undefined ? data.profileImage : prev.profileImage
        }));
    };

    const logout = () => {
        setState(prev => ({ ...prev, userName: '', userEmail: '', userPhone: '', userId: null, profileImage: null, isLoggedIn: false }));
    };

    const resetProject = () => {
        setState(prev => ({
            ...prev,
            construction: initialState.construction,
            interior: initialState.interior
        }));
    };

    const getProjects = (): SavedProject[] => {
        const saved = localStorage.getItem(`projects_list_${state.userName}`);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse projects:', e);
            }
        }
        return [];
    };

    const saveProject = (project: Omit<SavedProject, 'id' | 'date' | 'userName'>) => {
        const projects = getProjects();
        const newProject: SavedProject = {
            ...project,
            id: crypto.randomUUID(),
            date: Date.now(),
            userName: state.userName
        };
        const updatedProjects = [newProject, ...projects];
        localStorage.setItem(`projects_list_${state.userName}`, JSON.stringify(updatedProjects));
    };

    const deleteProject = (id: string) => {
        const projects = getProjects();
        const updatedProjects = projects.filter(p => p.id !== id);
        localStorage.setItem(`projects_list_${state.userName}`, JSON.stringify(updatedProjects));
    };

    const loadProject = (id: string) => {
        const projects = getProjects();
        const project = projects.find(p => p.id === id);
        if (project) {
            setState(prev => ({
                ...prev,
                construction: project.constructionData || prev.construction,
                interior: project.interiorData || prev.interior
            }));
        }
    };

    return (
        <ProjectContext.Provider value={{ 
            state, 
            updateConstruction, 
            updateInterior, 
            setUserName, 
            updateProfile, 
            logout, 
            resetProject,
            saveProject,
            getProjects,
            deleteProject,
            loadProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error('useProject must be used within ProjectProvider');
    return context;
};
