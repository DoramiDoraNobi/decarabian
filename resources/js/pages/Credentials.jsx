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

    const updateSecret = async (id, currentName) => {
        const newSecret = prompt(`Enter new secret for ${currentName}:`);
        if (!newSecret) return;
        try {
            await api.put(`/credentials/${id}`, { secret: newSecret });
            alert('Secret updated and encrypted securely!');
        } catch (err) {
            alert('Failed to update secret');
        }
    };

    const deleteCredential = async (id, currentName) => {
        if (!confirm(`Are you sure you want to delete ${currentName}? This will break any associated tools.`)) return;
        try {
            await api.delete(`/credentials/${id}`);
            loadCredentials();
        } catch (err) {
            alert('Failed to delete credential');
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
                        <div key={cred.id} className="border border-gray-800 rounded-xl p-5 bg-[#09090b] hover:border-indigo-500/50 transition-colors flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-200">{cred.name}</h3>
                                    <span className="text-[10px] font-bold tracking-wider uppercase bg-gray-800 text-gray-400 px-2 py-1 rounded">
                                        {cred.provider || 'CUSTOM'}
                                    </span>
                                </div>
                                <p className="text-xs font-mono bg-[#121214] border border-gray-800 px-3 py-2 rounded mt-4 text-center text-gray-500 tracking-[0.2em]">
                                    ••••••••••••••••
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                                <button onClick={() => updateSecret(cred.id, cred.name)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                                    EDIT SECRET
                                </button>
                                <button onClick={() => deleteCredential(cred.id, cred.name)} className="text-xs font-bold text-red-500 hover:text-red-400">
                                    DELETE
                                </button>
                            </div>
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
