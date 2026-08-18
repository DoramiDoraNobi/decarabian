import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Credentials from './pages/Credentials';
import Tools from './pages/Tools';
import AuditLogs from './pages/AuditLogs';
import Docs from './pages/Docs';
import LandingPage from './pages/LandingPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/app',
        element: <AdminLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'agents', element: <Agents /> },
            { path: 'credentials', element: <Credentials /> },
            { path: 'tools', element: <Tools /> },
            { path: 'audit-logs', element: <AuditLogs /> },
        ]
    },
    {
        path: '/docs',
        element: <Docs />
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
