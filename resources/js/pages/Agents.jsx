import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

export default function Agents() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tokenAlert, setTokenAlert] = useState(null);
    
    // Manage Permissions Modal State
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [allTools, setAllTools] = useState([]);
    const [agentTools, setAgentTools] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    // Create/Edit Agent Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingAgentId, setEditingAgentId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', rate_limit: 60 });

    const loadAgents = () => {
        api.get('/agents')
           .then(res => setAgents(res.data.data))
           .catch(err => alert("Failed to load agents"))
           .finally(() => setLoading(false));
    };

    useEffect(() => { loadAgents(); }, []);

    const openCreateModal = () => {
        setEditingAgentId(null);
        setFormData({ name: '', description: '', rate_limit: 60 });
        setIsFormModalOpen(true);
    };

    const openEditModal = (agent) => {
        setEditingAgentId(agent.id);
        setFormData({ name: agent.name, description: agent.description || '', rate_limit: agent.rate_limit || 60 });
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAgentId) {
                await api.put(`/agents/${editingAgentId}`, formData);
                alert("Agent updated successfully!");
            } else {
                const res = await api.post('/agents', formData);
                setTokenAlert({ token: res.data.plain_token, warning: res.data.warning });
            }
            setIsFormModalOpen(false);
            loadAgents();
        } catch (err) {
            alert("Failed to save agent");
        }
    };

    const deleteAgent = async (id, name) => {
        if (!confirm(`Are you sure you want to delete the AI Agent "${name}"? This action is irreversible.`)) return;
        try {
            await api.delete(`/agents/${id}`);
            loadAgents();
        } catch (err) {
            alert("Failed to delete agent");
        }
    };

    const regenerateToken = async (id, name) => {
        if (!confirm(`Warning: Regenerating the token for "${name}" will instantly revoke the old token and break running scripts. Continue?`)) return;
        try {
            const res = await api.post(`/agents/${id}/regenerate-token`);
            setTokenAlert({ token: res.data.plain_token, warning: res.data.warning });
            loadAgents();
        } catch (err) {
            alert("Failed to regenerate token");
        }
    };

    const openPermissionsModal = async (agent) => {
        setSelectedAgent(agent);
        setModalLoading(true);
        try {
            const toolsRes = await api.get('/tools');
            setAllTools(toolsRes.data.data);
            const agentRes = await api.get(`/agents/${agent.id}`);
            const permittedToolIds = agentRes.data.data.tools.map(t => t.id);
            setAgentTools(permittedToolIds);
        } catch (err) {
            alert("Failed to load permissions");
        } finally {
            setModalLoading(false);
        }
    };

    const toggleTool = (toolId) => {
        if (agentTools.includes(toolId)) {
            setAgentTools(agentTools.filter(id => id !== toolId));
        } else {
            setAgentTools([...agentTools, toolId]);
        }
    };

    const savePermissions = async () => {
        try {
            await api.post(`/agents/${selectedAgent.id}/tools`, { tool_ids: agentTools });
            alert("Permissions updated successfully!");
            setSelectedAgent(null);
            loadAgents();
        } catch (err) {
            alert("Failed to save permissions.");
        }
    };

    if (loading) return <div className="text-gray-400">Loading agents...</div>;

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-wide">AI Agents</h1>
                <button onClick={openCreateModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-500 transition-colors">
                    + CREATE AGENT
                </button>
            </div>

            {tokenAlert && (
                <div className="bg-indigo-900/40 border border-indigo-500/50 rounded-xl p-6 relative">
                    <button onClick={() => setTokenAlert(null)} className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-300">✕</button>
                    <h3 className="text-lg font-bold text-indigo-300 mb-2">New Agent Token Generated!</h3>
                    <p className="text-sm text-gray-300 mb-4">{tokenAlert.warning}</p>
                    <div className="bg-black/50 p-4 rounded-lg flex items-center justify-between border border-indigo-500/30">
                        <code className="text-indigo-400 font-mono font-bold tracking-wider">{tokenAlert.token}</code>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-5">
                {agents.map(agent => (
                    <div key={agent.id} className="bg-[#121214] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-indigo-500/30 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                                {agent.is_active ? (
                                    <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase">Active</span>
                                ) : (
                                    <span className="bg-red-900/30 text-red-400 border border-red-800/50 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase">Disabled</span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{agent.description || 'No description provided.'}</p>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center text-gray-500">
                                    <span className="font-mono text-xs bg-[#09090b] px-2 py-1 rounded border border-gray-800 mr-2">Rate Limit</span>
                                    {agent.rate_limit} req/min
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <span className="font-mono text-xs bg-[#09090b] px-2 py-1 rounded border border-gray-800 mr-2">Permitted Tools</span>
                                    {agent.tools_count}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-3">
                            <button onClick={() => openPermissionsModal(agent)} className="px-4 py-2 bg-[#09090b] border border-gray-800 hover:border-indigo-500 text-indigo-400 text-sm font-bold rounded-lg transition-colors">
                                MANAGE TOOLS
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(agent)} className="px-3 py-2 bg-[#09090b] border border-gray-800 hover:border-gray-600 text-gray-300 text-sm font-bold rounded-lg transition-colors">
                                    EDIT
                                </button>
                                <button onClick={() => regenerateToken(agent.id, agent.name)} className="px-3 py-2 bg-[#09090b] border border-gray-800 hover:border-yellow-600/50 text-yellow-500 text-sm font-bold rounded-lg transition-colors" title="Regenerate Token">
                                    ↻ TOKEN
                                </button>
                                <button onClick={() => deleteAgent(agent.id, agent.name)} className="px-3 py-2 bg-[#09090b] border border-gray-800 hover:border-red-900/50 text-red-500 text-sm font-bold rounded-lg transition-colors">
                                    DELETE
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {agents.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl bg-[#121214]">
                        <p className="text-gray-500">No agents deployed yet. Create your first AI agent to get started.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Agent Modal */}
            {isFormModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#09090b] border border-gray-800 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">{editingAgentId ? 'Edit AI Agent' : 'Deploy New AI Agent'}</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">AGENT NAME</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. Customer Support Bot" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">DESCRIPTION</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm h-20" placeholder="What does this agent do?" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">RATE LIMIT (req/min)</label>
                                <input type="number" min="1" max="10000" required value={formData.rate_limit} onChange={e => setFormData({...formData, rate_limit: parseInt(e.target.value)})} className="w-full bg-[#121214] border border-gray-700 rounded px-3 py-2 text-white text-sm" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white">CANCEL</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded">{editingAgentId ? 'SAVE CHANGES' : 'DEPLOY AGENT'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Permissions Modal */}
            {selectedAgent && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#121214] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#09090b] rounded-t-xl">
                            <div>
                                <h2 className="text-xl font-bold text-white">Manage Tools</h2>
                                <p className="text-sm text-gray-500">Configure what <span className="text-indigo-400 font-bold">{selectedAgent.name}</span> is allowed to do.</p>
                            </div>
                            <button onClick={() => setSelectedAgent(null)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {modalLoading ? (
                                <div className="text-center py-10 text-gray-500">Loading tools...</div>
                            ) : (
                                <div className="space-y-3">
                                    {allTools.map(tool => {
                                        const isChecked = agentTools.includes(tool.id);
                                        return (
                                            <div 
                                                key={tool.id} 
                                                onClick={() => toggleTool(tool.id)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                                                    isChecked 
                                                    ? 'bg-indigo-900/20 border-indigo-500/50' 
                                                    : 'bg-[#09090b] border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className={`font-bold ${isChecked ? 'text-indigo-300' : 'text-gray-300'}`}>{tool.name}</h4>
                                                        <span className="text-[10px] font-mono bg-black/50 text-gray-500 px-2 py-0.5 rounded border border-gray-800">{tool.http_method}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-mono truncate max-w-md">{tool.target_url}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${isChecked ? 'bg-indigo-600' : 'bg-gray-800'}`}>
                                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {allTools.length === 0 && (
                                        <div className="text-center text-gray-500 py-10 border border-dashed border-gray-800 rounded-xl">
                                            No tools registered in the system.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="px-6 py-4 border-t border-gray-800 bg-[#09090b] flex justify-end gap-3 rounded-b-xl">
                            <button onClick={() => setSelectedAgent(null)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                                CANCEL
                            </button>
                            <button onClick={savePermissions} className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors">
                                SAVE PERMISSIONS
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
