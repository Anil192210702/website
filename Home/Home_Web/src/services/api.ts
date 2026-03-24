import axios from 'axios';

const BASE_URL = `http://180.235.121.253:8067`;
const API_KEY = 'AIzaSyC-Mk1z7Sl7QlRc11Dp6cAOHtHMZlw9MnU';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json'
    }
});

// Auth API
export const authApi = {
    login: (credentials: any) => apiClient.post('/api/login/', credentials),
    register: (userData: any) => apiClient.post('/api/register/', userData),
    requestOtp: (data: any) => apiClient.post('/api/request-otp/', data),
    verifyOtp: (data: any) => apiClient.post('/api/verify-otp/', data),
    resetPassword: (data: any) => apiClient.post('/api/reset-password/', data),
};

// Construction API
export const constructionApi = {
    createProject: (data: any) => apiClient.post('/api/construction/create-project/', data),
    calculateBase: (projectId: number) => apiClient.post('/api/construction/calculate-base/', { project_id: projectId }),
    calculateTotal: (projectId: number) => axios.post(`${BASE_URL}/api/construction/calculate-total/`, { project_id: projectId }),
    deleteProject: (projectId: number) => axios.post(`${BASE_URL}/api/construction/delete-project/`, { project_id: projectId }),
    getOptimizationSuggestions: (projectId: number) => apiClient.post('/api/construction/optimization-suggestions/', { project_id: projectId }),
    applyOptimizations: (projectId: number, selectedSavings: number) => apiClient.post('/api/construction/apply-optimizations/', { 
        project_id: projectId,
        selected_savings: selectedSavings
    }),
    seedRates: () => apiClient.post('/api/construction/seed-rates/'),
    listProjects: (userId: string | number) => apiClient.post('/api/construction/list-projects/', { user_id: userId }),
};

// Interior API
export const interiorApi = {
    getLocationMultiplier: (data: any) => apiClient.post('/api/interior/location/', data),
    calculate: (data: any) => axios.post(`${BASE_URL}/api/interior/calculate/`, data),
    deleteEstimate: (estimateId: number) => axios.post(`${BASE_URL}/api/interior/delete-estimate/`, { estimate_id: estimateId }),
    listEstimates: (userId: string) => axios.post(`${BASE_URL}/api/interior/list-estimates/`, { user_id: userId }),
};
