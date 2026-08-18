import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            api.get('/user')
               .then(res => setUser(res.data.data))
               .catch(() => {
                   localStorage.removeItem('admin_token');
                   setUser(null);
               })
               .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('admin_token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
