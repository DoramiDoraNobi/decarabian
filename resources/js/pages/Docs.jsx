import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Terminal, Code2, Cpu, ArrowLeft } from 'lucide-react';

export default function Docs() {
    // Default to 'quickstart' based on prompt instructions
    const [activeSection, setActiveSection] = useState('quickstart');

    const sections = [
        { id: 'intro', title: 'Introduction', icon: ShieldCheck },
        { id: 'quickstart', title: 'Quick Start Guide', icon: Sparkles },
        { id: 'python', title: 'Python SDK', icon: Terminal },
        { id: 'js', title: 'JavaScript SDK', icon: Code2 },
        { id: 'skills', title: 'AI Skills & Prompting', icon: Cpu },
    ];

    return (
        <div className="flex h-screen bg-[#0B1120] text-slate-300 font-sans selection:bg-cyan-500/30">
            {/* Standalone Docs Sidebar (Fixed Width ~260px) */}
            <div className="w-[260px] bg-[#0F172A] border-r border-slate-800/80 flex flex-col shadow-xl z-10 shrink-0">
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
                    <img src="/logo.png" alt="Decarabian" className="h-8 w-8 object-contain mr-3 rounded" />
                    <h1 className="text-lg font-bold text-slate-50 tracking-wider font-heading uppercase">DECARABIAN</h1>
                </div>

                {/* Back to App Link */}
                <div className="px-4 py-4 border-b border-slate-800/80">
                    <Link to="/" className="flex items-center text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Docs Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-3 font-heading">
                        Documentation
                    </div>
                    {sections.map(section => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                    isActive
                                    ? 'bg-cyan-900/20 text-cyan-400 border-l-2 border-cyan-400 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent'
                                }`}
                            >
                                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                                {section.title}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-[#0B1120]">
                {/* Max-width container to prevent sparse look (720-800px) */}
                <main className="max-w-[760px] mx-auto px-8 py-16 animate-fadeIn">
                    
                    {activeSection === 'quickstart' && (
                        <div className="space-y-10">
                            {/* Header Section */}
                            <div>
                                <h1 className="text-4xl font-bold text-slate-50 mb-4 font-heading tracking-tight">Quick Start Guide</h1>
                                <p className="text-lg leading-relaxed text-slate-400">
                                    Get your first autonomous AI agent secured in under 3 minutes. Decarabian acts as the ultimate shield, <span className="text-cyan-400 font-medium">protecting your API keys from malicious prompts or AI hallucinations.</span>
                                </p>
                            </div>

                            {/* Refined Cards Section for Steps */}
                            <div className="space-y-5">
                                {/* Step 1 */}
                                <div className="bg-[#0F172A] border border-slate-800/80 rounded-lg p-5 shadow-sm hover:border-slate-700 transition-colors flex items-start gap-5 group">
                                    <div className="flex-shrink-0 w-10 h-10 rounded bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-heading text-lg group-hover:bg-cyan-900/40 transition-colors">
                                        1
                                    </div>
                                    <div className="pt-0.5">
                                        <h3 className="text-slate-100 font-bold font-heading text-lg mb-1.5">Add a Credential</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Navigate to <strong>Credentials</strong> and save your provider's secret key (e.g., Stripe Secret Key). Decarabian encrypts this at rest using AES-256. It is never exposed to the AI.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="bg-[#0F172A] border border-slate-800/80 rounded-lg p-5 shadow-sm hover:border-slate-700 transition-colors flex items-start gap-5 group">
                                    <div className="flex-shrink-0 w-10 h-10 rounded bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-heading text-lg group-hover:bg-cyan-900/40 transition-colors">
                                        2
                                    </div>
                                    <div className="pt-0.5">
                                        <h3 className="text-slate-100 font-bold font-heading text-lg mb-1.5">Register a Tool</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Navigate to <strong>Tools</strong>. Define an endpoint name like <code>stripe.create_invoice</code>, set the target URL to <code>https://api.stripe.com/v1/invoices</code>, and link it to the credential you just saved.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="bg-[#0F172A] border border-slate-800/80 rounded-lg p-5 shadow-sm hover:border-slate-700 transition-colors flex items-start gap-5 group">
                                    <div className="flex-shrink-0 w-10 h-10 rounded bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-heading text-lg group-hover:bg-cyan-900/40 transition-colors">
                                        3
                                    </div>
                                    <div className="pt-0.5">
                                        <h3 className="text-slate-100 font-bold font-heading text-lg mb-1.5">Provision an Agent</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Go to <strong>Agents</strong> and click "Create Agent". Copy the generated <code>ag_...</code> token. Click <strong>Manage Permissions</strong> to explicitly assign your new tool to this agent.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="bg-[#0F172A] border border-slate-800/80 rounded-lg p-5 shadow-sm hover:border-slate-700 transition-colors flex items-start gap-5 group">
                                    <div className="flex-shrink-0 w-10 h-10 rounded bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-heading text-lg group-hover:bg-cyan-900/40 transition-colors">
                                        4
                                    </div>
                                    <div className="pt-0.5">
                                        <h3 className="text-slate-100 font-bold font-heading text-lg mb-1.5">Connect SDK</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Inject the <code>ag_...</code> token into your AI environment variables. Use the official Python or JavaScript SDK to execute tools securely via the Gateway.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other sections to keep the demo tight */}
                    {activeSection !== 'quickstart' && (
                        <div className="space-y-8 animate-fadeIn">
                            <h1 className="text-4xl font-bold text-slate-50 mb-4 font-heading tracking-tight">{sections.find(s => s.id === activeSection)?.title}</h1>
                            <div className="bg-[#0F172A] border border-slate-800/80 rounded-lg p-6 shadow-sm">
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    This section is currently under construction. Please refer to the Quick Start Guide for initial setup instructions.
                                </p>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
