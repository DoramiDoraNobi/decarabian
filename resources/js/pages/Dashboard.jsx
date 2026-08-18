import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Activity, AlertCircle, Clock, Database } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/audit-logs/stats')
           .then(res => setStats(res.data.data))
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-gray-400">Loading metrics...</div>;
    if (!stats) return <div className="text-red-400">Failed to load stats</div>;

    const cards = [
        { name: 'Total Requests (24h)', value: stats.total_requests, icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
        { name: 'Error Rate', value: `${stats.error_rate}%`, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        { name: 'Avg Execution', value: `${stats.avg_execution_time_ms}ms`, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { name: 'Errors (24h)', value: stats.error_requests, icon: Database, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white tracking-wide">Gateway Overview</h1>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.name} className={`bg-[#121214] overflow-hidden rounded-xl border ${card.border}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`rounded-lg p-3 ${card.bg}`}>
                                        <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-400 truncate">{card.name}</dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-white mt-1">{card.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-[#121214] rounded-xl border border-gray-800 p-6 mt-8">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
                    System Operational
                </h3>
                <p className="text-gray-400 text-sm">
                    Decarabian is actively monitoring your AI agents. All traffic is being proxied securely.
                </p>
            </div>
        </div>
    );
}
