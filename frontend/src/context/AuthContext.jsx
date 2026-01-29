import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    // Uses relative URLs — proxied by Vite (dev), nginx (Docker), or tunnel
    axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? '';
    axios.defaults.timeout = 10000; // 10s timeout to prevent hanging checkAuth

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        await fetchProfile();
                    }
                } catch (err) {
                    console.error('Auth check failed:', err);
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/auth/profile/');
            setUser(res.data);
            return true;
        } catch (err) {
            console.error('Failed to fetch profile', err);
            if (err.response?.status === 401) {
                logout();
            }
            return false;
        }
    };

    const login = async (username, password) => {
        try {
            // Ensure username is lowercased for consistency
            const res = await axios.post('/api/auth/login/', {
                username: username.toLowerCase(),
                password
            });
            const { access, refresh } = res.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            const success = await fetchProfile();
            return success;
        } catch (err) {
            console.error('Login failed', err);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.setItem('justLoggedOut', 'true');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
