import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

export default function Credentials() {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCredentials = () => {
        api.get('/credentials')
           .then(res => setCredentials(res.data.data))
           .catch(err => alert("Failed to load credentials"))
           .finally(() => setLoading(false));
    };

    useEffect(() => { loadCredentials(); }, []);

    const createCredential = async () => {
        const name = prompt("Credential Name (e.g. Stripe API):");
        const provider = prompt("Provider Name (e.g. stripe):");
        const secret = prompt("Secret Key:");
        if (!name || !provider || !secret) return;
        
        try {
            await api.post('/credentials', { name, provider, secret, auth_type: 'bearer' });
            loadCredentials();
        } catch (err) {
            alert("Failed to create credential");
        }
    };

    if (loading) return <div className="text-gray-400">Loading vault...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-wide">Credentials Vault</h1>
                <button onClick={createCredential} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-500 transition-colors">
                    + SECURE NEW KEY
                </button>
            </div>
            <div className="bg-[#121214] border border-gray-800 rounded-xl p-6">
                <p className="text-sm text-gray-500 mb-6 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                    Secrets are encrypted at rest (AES-256) and never returned via the API.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {credentials.map(cred => (
                        <div key={cred.id} className="border border-gray-800 rounded-xl p-5 bg-[#09090b] hover:border-indigo-500/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-200">{cred.name}</h3>
                                <span className="text-[10px] font-bold tracking-wider uppercase bg-gray-800 text-gray-400 px-2 py-1 rounded">
                                    {cred.provider}
                                </span>
                            </div>
                            <p className="text-xs font-mono bg-[#121214] border border-gray-800 px-3 py-2 rounded mt-4 text-center text-gray-500 tracking-[0.2em]">
                                ••••••••••••••••
                            </p>
                        </div>
                    ))}
                    {credentials.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-gray-600 border border-dashed border-gray-800 rounded-xl">
                            No credentials stored. Your vault is empty.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
