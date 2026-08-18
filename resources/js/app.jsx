import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </React.StrictMode>
    );
}
