import { useState, useCallback } from 'react';

export function useAuth() {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

    const validateUserData = (userData) => {
        if (!userData || typeof userData !== 'object') {
            throw new Error('Invalid user data');
        }

        const requiredFields = ['token', 'role', 'userId'];
        const missingFields = requiredFields.filter(field => !userData[field]);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        const validRoles = ['admin', 'doctor', 'staff', 'patient'];
        const normalizedRole = userData.role.toLowerCase();

        if (!validRoles.includes(normalizedRole)) {
            throw new Error(`Invalid role: ${userData.role}`);
        }

        return {
            token: userData.token,
            role: normalizedRole,
            userId: String(userData.userId)
        };
    };

    const login = useCallback((userData) => {
        try {
            const validatedData = validateUserData(userData);

            setToken(validatedData.token);
            setUserRole(validatedData.role);
            setUserId(validatedData.userId);

            localStorage.setItem('token', validatedData.token);
            localStorage.setItem('userRole', validatedData.role);
            localStorage.setItem('userId', validatedData.userId);
        } catch (error) {
            console.error('Login validation failed:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserRole(null);
        setUserId(null);

        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
    }, []);

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