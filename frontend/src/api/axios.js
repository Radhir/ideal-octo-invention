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
    async error => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (refreshToken) {
                try {
                    // Attempt to get a new access token
                    const res = await axios.post(`${api.defaults.baseURL}/api/auth/token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    if (res.status === 200) {
                        const { access } = res.data;
                        localStorage.setItem('access_token', access);
                        
                        // Update the authorization header for the original request
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                        
                        // Retry the original request with the new token
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Refresh token is also invalid, clear storage and login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } else {
                // No refresh token available, redirect to login
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
