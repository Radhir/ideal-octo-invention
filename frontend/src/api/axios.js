import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? ''
});

// Request Interceptor
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const branchId = localStorage.getItem('elite_current_branch');
    if (branchId) {
        config.headers['X-Branch-ID'] = branchId;
    }

    return config;
}, error => Promise.reject(error));

// Response Interceptor (for auth errors)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle token expiry or unauthorized
            // We can dispatch a logout event or just let AuthContext handle it if it checks expiry
            // For now, we propagate the error
        }
        return Promise.reject(error);
    }
);

export default api;
