// src/hooks/useAuth.js
import { useState } from 'react';

export function useAuth() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const login = (userData) => {
        const normalizedRole = userData.role.toLowerCase();
        setToken(userData.token);
        setUserRole(normalizedRole);
        setUserId(userData.userId);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userRole', normalizedRole);
        localStorage.setItem('userId', userData.userId);
    };

    const logout = () => {
        setToken(null);
        setUserRole(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
    };

    const isAuthenticated = !!token;

    return {
        token,
        userRole,
        userId,
        login,
        logout,
        isAuthenticated
    };
}
