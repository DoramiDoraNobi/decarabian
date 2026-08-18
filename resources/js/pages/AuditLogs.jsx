import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/audit-logs')
           .then(res => setLogs(res.data.data))
           .catch(() => {})
           .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-gray-400">Loading audit logs...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white tracking-wide">Audit Logs</h1>
            <div className="bg-[#121214] overflow-hidden border border-gray-800 rounded-xl">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#09090b]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Timestamp</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Agent</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                                    {log.agent?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{log.action}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md border ${
                                        log.http_status >= 400 
                                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                        {log.http_status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-600">No logs found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
