import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

export default function Tools() {
    const [tools, setTools] = useState([]);
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Create/Edit Tool Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingToolId, setEditingToolId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', target_url: '', http_method: 'POST', credential_id: ''
    });

    const loadData = async () => {
        try {
            const [toolsRes, credsRes] = await Promise.all([
                api.get('/tools'),
                api.get('/credentials')
            ]);
            setTools(toolsRes.data.data);
            setCredentials(credsRes.data.data);
        } catch (err) {} finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openCreateModal = () => {
        setEditingToolId(null);
        setFormData({
            name: '', description: '', target_url: '', http_method: 'POST',
            credential_id: credentials.length > 0 ? credentials[0].id : ''
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (tool) => {
        setEditingToolId(tool.id);
        setFormData({
            name: tool.name, 
            description: tool.description || '', 
            target_url: tool.target_url, 
            http_method: tool.http_method, 
            credential_id: tool.credential_id || ''
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, parameters_schema: {} };
            if (editingToolId) {
                await api.put(`/tools/${editingToolId}`, payload);
            } else {
                await api.post('/tools', payload);
            }
            setIsFormModalOpen(false);
            loadData();
        } catch (err) {
            alert("Failed to save tool");
        }
    };

    const deleteTool = async (id, name) => {
        if (!confirm(`Are you sure you want to delete the tool "${name}"? Agents will lose access to it.`)) return;
        try {
            await api.delete(`/tools/${id}`);
            loadData();
        } catch (err) {
            alert("Failed to delete tool");
        }
    };

    if (loading) return <div className="text-gray-400">Loading tools...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-wide">Registered Tools</h1>
                <button onClick={openCreateModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-500 transition-colors">
                    + REGISTER TOOL
                </button>
            </div>

            <div className="bg-[#121214] overflow-hidden border border-gray-800 rounded-xl">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#09090b]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Tool Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Target URL</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Method</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {tools.map(tool => (
                            <tr key={tool.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">{tool.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono max-w-xs truncate">{tool.target_url}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`border font-mono font-bold px-2.5 py-1 rounded-md text-xs ${
                                        tool.http_method === 'GET' ? 'bg-blue-900/30 border-blue-800 text-blue-400' :
                                        tool.http_method === 'POST' ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400' :
                                        tool.http_method === 'DELETE' ? 'bg-red-900/30 border-red-800 text-red-400' :
                                        'bg-gray-800 border-gray-700 text-gray-300'
                                    }`}>
                                        {tool.http_method}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEditModal(tool)} className="text-indigo-400 hover:text-indigo-300 mr-4 font-bold">EDIT</button>
                                    <button onClick={() => deleteTool(tool.id, tool.name)} className="text-red-500 hover:text-red-400 font-bold">DELETE</button>
                                </td>
                            </tr>
                        ))}
                        {tools.length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-600">No tools registered</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Tool Modal */}
            {isFormModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#09090b] border border-gray-800 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">{editingToolId ? 'Edit Tool' : 'Register New Tool'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">TOOL NAME</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. github.issue.create" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">DESCRIPTION (Optional)</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm h-16" placeholder="What does this tool do?" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">TARGET URL</label>
                                <input type="url" required value={formData.target_url} onChange={e => setFormData({...formData, target_url: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono" placeholder="https://api.github.com/..." />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-400 mb-1">METHOD</label>
                                    <select value={formData.http_method} onChange={e => setFormData({...formData, http_method: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono">
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="PATCH">PATCH</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                </div>
                                <div className="w-2/3">
                                    <label className="block text-xs font-bold text-gray-400 mb-1">CREDENTIAL TO INJECT</label>
                                    <select value={formData.credential_id} onChange={e => setFormData({...formData, credential_id: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm">
                                        <option value="">-- No Authentication --</option>
                                        {credentials.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.provider || 'custom'})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white">CANCEL</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded">{editingToolId ? 'SAVE CHANGES' : 'REGISTER TOOL'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
