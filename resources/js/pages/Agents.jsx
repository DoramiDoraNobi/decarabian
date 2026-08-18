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

    const loadAgents = () => {
        api.get('/agents')
           .then(res => setAgents(res.data.data))
           .catch(err => alert("Failed to load agents"))
           .finally(() => setLoading(false));
    };

    useEffect(() => { loadAgents(); }, []);

    const createAgent = async () => {
        const name = prompt("Agent Name:");
        if (!name) return;
        
        try {
            const res = await api.post('/agents', { name, description: "Created via Web UI", rate_limit: 100 });
            setTokenAlert({
                token: res.data.plain_token,
                warning: res.data.warning
            });
            loadAgents();
        } catch (err) {
            alert("Failed to create agent");
        }
    };

    const openPermissionsModal = async (agent) => {
        setSelectedAgent(agent);
        setModalLoading(true);
        try {
            // Fetch all available tools
            const toolsRes = await api.get('/tools');
            setAllTools(toolsRes.data.data);
            
            // Fetch agent specific tools
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
            loadAgents(); // Reload agents to update tools count
        } catch (err) {
            alert("Failed to save permissions.");
        }
    };

    if (loading) return <div className="text-gray-400">Loading agents...</div>;

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-wide">AI Agents</h1>
                <button onClick={createAgent} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-500 transition-colors">
                    + CREATE AGENT
                </button>
            </div>

            {tokenAlert && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-amber-400">
                                <strong>Agent Created Successfully!</strong><br />
                                {tokenAlert.warning}
                            </p>
                            <p className="mt-2 text-sm font-mono bg-[#09090b] text-white p-3 rounded-lg break-all border border-gray-800">
                                {tokenAlert.token}
                            </p>
                            <button onClick={() => setTokenAlert(null)} className="mt-3 text-sm font-bold text-amber-500 hover:text-amber-400">DISMISS</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#121214] overflow-hidden border border-gray-800 rounded-xl">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#09090b]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {agents.map(agent => (
                            <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{agent.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${agent.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {agent.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.tools_count} permitted</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => openPermissionsModal(agent)} 
                                        className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                                    >
                                        ⚙️ Manage Permissions
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {agents.length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">No agents registered</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Permissions */}
            {selectedAgent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#121214] border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-800 bg-[#09090b] flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">
                                Tool Permissions: <span className="text-indigo-400">{selectedAgent.name}</span>
                            </h3>
                            <button onClick={() => setSelectedAgent(null)} className="text-gray-500 hover:text-white">&times;</button>
                        </div>
                        
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {modalLoading ? (
                                <p className="text-gray-500 text-center py-4">Loading tools...</p>
                            ) : allTools.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No tools registered yet. Create a tool first.</p>
                            ) : (
                                <div className="space-y-3">
                                    {allTools.map(tool => {
                                        const isChecked = agentTools.includes(tool.id);
                                        return (
                                            <div 
                                                key={tool.id} 
                                                onClick={() => toggleTool(tool.id)}
                                                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                                    isChecked 
                                                    ? 'bg-indigo-500/10 border-indigo-500/50' 
                                                    : 'bg-[#09090b] border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div>
                                                    <h4 className={`font-bold ${isChecked ? 'text-indigo-300' : 'text-gray-300'}`}>
                                                        {tool.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
                                                </div>
                                                <div>
                                                    <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${isChecked ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        
                        <div className="px-6 py-4 border-t border-gray-800 bg-[#09090b] flex justify-end gap-3">
                            <button 
                                onClick={() => setSelectedAgent(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                CANCEL
                            </button>
                            <button 
                                onClick={savePermissions}
                                className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg transition-colors"
                            >
                                SAVE PERMISSIONS
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
