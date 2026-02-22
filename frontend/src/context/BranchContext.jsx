import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
    const { user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBranches = useCallback(async (force = false) => {
        // 1. Check Cache First
        if (!force) {
            const cached = sessionStorage.getItem('elite_branches_cache');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    // Cache duration: 1 hour
                    if (Date.now() - parsed.timestamp < 3600000) {
                        setBranches(parsed.data);
                        const storedBranchId = localStorage.getItem('elite_current_branch');
                        const found = parsed.data.find(b => b.id.toString() === storedBranchId);
                        if (found) setCurrentBranch(found);
                        else if (parsed.data.length > 0) {
                            const headOffice = parsed.data.find(b => b.is_head_office) || parsed.data[0];
                            setCurrentBranch(headOffice);
                            localStorage.setItem('elite_current_branch', headOffice.id);
                        }
                        setLoading(false);
                        return;
                    }
                } catch (e) { console.error("Cache parse failed", e); }
            }
        }

        try {
            const res = await api.get('/api/locations/branches/');
            const branchList = res.data.results || res.data;
            setBranches(branchList);

            // Update Cache
            sessionStorage.setItem('elite_branches_cache', JSON.stringify({
                data: branchList,
                timestamp: Date.now()
            }));

            // Auto-select stored branch or first available
            const storedBranchId = localStorage.getItem('elite_current_branch');
            const found = branchList.find(b => b.id.toString() === storedBranchId);

            if (found) {
                setCurrentBranch(found);
            } else if (branchList.length > 0) {
                // Default to Head Office or first
                const headOffice = branchList.find(b => b.is_head_office) || branchList[0];
                setCurrentBranch(headOffice);
                localStorage.setItem('elite_current_branch', headOffice.id);
            }
        } catch (err) {
            console.error("Failed to load branches", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchBranches();
        } else {
            setLoading(false);
            // Clear cache on logout
            sessionStorage.removeItem('elite_branches_cache');
        }
    }, [user, fetchBranches]);

    const switchBranch = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        if (branch) {
            setCurrentBranch(branch);
            localStorage.setItem('elite_current_branch', branchId);
            window.location.reload();
        }
    };

    return (
        <BranchContext.Provider value={{ branches, currentBranch, switchBranch, loading }}>
            {children}
        </BranchContext.Provider>
    );
};

export const useBranch = () => useContext(BranchContext);
