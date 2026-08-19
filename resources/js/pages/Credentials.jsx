import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

export default function Credentials() {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', provider: '', secret: '', auth_type: 'bearer', auth_header_name: ''
    });

    const loadCredentials = () => {
        api.get('/credentials')
           .then(res => setCredentials(res.data.data))
           .catch(err => alert("Failed to load credentials"))
           .finally(() => setLoading(false));
    };

    useEffect(() => { loadCredentials(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/credentials', formData);
            loadCredentials();
            setIsModalOpen(false);
            setFormData({ name: '', provider: '', secret: '', auth_type: 'bearer', auth_header_name: '' });
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
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-wide">Credentials Vault</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-500 transition-colors">
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
                                <p className="text-xs text-gray-500 mt-2">Auth: {cred.auth_type.toUpperCase()}</p>
                                <p className="text-xs font-mono bg-[#121214] border border-gray-800 px-3 py-2 rounded mt-2 text-center text-gray-500 tracking-[0.2em]">
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

            {/* Modal for creating credential */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#09090b] border border-gray-800 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Store Secure Credential</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">NAME</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. AcmeCorp API" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">PROVIDER (Optional)</label>
                                <input type="text" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. acme" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">AUTH TYPE</label>
                                <select value={formData.auth_type} onChange={e => setFormData({...formData, auth_type: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm">
                                    <option value="bearer">Bearer Token (Authorization: Bearer X)</option>
                                    <option value="header">Custom Header (e.g. X-API-Key: X)</option>
                                    <option value="query">Query Parameter (e.g. ?api_key=X)</option>
                                </select>
                            </div>
                            {formData.auth_type !== 'bearer' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1">HEADER / QUERY NAME</label>
                                    <input type="text" required value={formData.auth_header_name} onChange={e => setFormData({...formData, auth_header_name: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. X-API-Key or Authorization" />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">SECRET KEY</label>
                                <input type="password" required value={formData.secret} onChange={e => setFormData({...formData, secret: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="Paste secret here..." />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white">CANCEL</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded">SECURE & SAVE</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
