import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

export default function Tools() {
    const [tools, setTools] = useState([]);
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [httpMethod, setHttpMethod] = useState('POST');
    const [credentialId, setCredentialId] = useState('');

    const loadData = async () => {
        try {
            const [toolsRes, credsRes] = await Promise.all([
                api.get('/tools'),
                api.get('/credentials')
            ]);
            setTools(toolsRes.data.data);
            setCredentials(credsRes.data.data);
            if (credsRes.data.data.length > 0) {
                setCredentialId(credsRes.data.data[0].id);
            }
        } catch (err) {} finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tools', { name, description, target_url: targetUrl, http_method: httpMethod, credential_id: credentialId, parameters_schema: {} });
            setShowForm(false);
            setName(''); setDescription(''); setTargetUrl('');
            loadData();
        } catch (err) {
            alert("Failed to create tool");
        }
    };

    if (loading) return <div className="text-gray-400">Loading tools...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-wide">Tools Registry</h1>
                <button onClick={() => setShowForm(!showForm)} className={`px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors ${showForm ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                    {showForm ? 'CANCEL' : '+ REGISTER TOOL'}
                </button>
            </div>

            {showForm && (
                <div className="bg-[#121214] rounded-xl border border-gray-800 p-6">
                    <h2 className="text-lg font-medium text-white mb-6 border-b border-gray-800 pb-2">Register New API Target</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tool Name <span className="text-gray-600">(e.g. github.create_issue)</span></label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="block w-full rounded-lg bg-[#09090b] border border-gray-700 text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="block w-full rounded-lg bg-[#09090b] border border-gray-700 text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Target URL</label>
                            <input type="url" required value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="block w-full rounded-lg bg-[#09090b] border border-gray-700 text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-sm" placeholder="https://api.github.com/..." />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">HTTP Method</label>
                                <select value={httpMethod} onChange={e => setHttpMethod(e.target.value)} className="block w-full rounded-lg bg-[#09090b] border border-gray-700 text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                                    <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Credential to Inject</label>
                                <select required value={credentialId} onChange={e => setCredentialId(e.target.value)} className="block w-full rounded-lg bg-[#09090b] border border-gray-700 text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                                    {credentials.length === 0 && <option value="">No credentials available</option>}
                                    {credentials.map(cred => <option key={cred.id} value={cred.id}>{cred.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center">
                            <button type="submit" disabled={credentials.length === 0} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-emerald-500 disabled:opacity-50">
                                SAVE TOOL
                            </button>
                            {credentials.length === 0 && <span className="ml-4 text-sm text-red-400 font-medium">Create a Credential first!</span>}
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[#121214] overflow-hidden border border-gray-800 rounded-xl">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#09090b]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Tool Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Target URL</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Method</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {tools.map(tool => (
                            <tr key={tool.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">{tool.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{tool.target_url}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="bg-gray-800 border border-gray-700 text-gray-300 font-mono font-bold px-2.5 py-1 rounded-md text-xs">{tool.http_method}</span>
                                </td>
                            </tr>
                        ))}
                        {tools.length === 0 && (
                            <tr><td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-600">No tools registered</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
