import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const BranchContext = createContext();

export const useBranch = () => useContext(BranchContext);

export const BranchProvider = ({ children }) => {
    const { user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBranches();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchBranches = async () => {
        try {
            const res = await api.get('/api/locations/branches/');
            const branchList = res.data.results || res.data;
            setBranches(branchList);

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
    };

    const switchBranch = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        if (branch) {
            setCurrentBranch(branch);
            localStorage.setItem('elite_current_branch', branchId);
            // Optionally reload page to refresh all data if not using specialized hook
            // window.location.reload(); 
        }
    };

    return (
        <BranchContext.Provider value={{ branches, currentBranch, switchBranch, loading }}>
            {children}
        </BranchContext.Provider>
    );
};
