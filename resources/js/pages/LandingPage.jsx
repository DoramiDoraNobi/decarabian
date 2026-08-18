import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Anchor, Server, Lock, ArrowRight, GitBranch, Terminal, Key, Activity, Coffee } from 'lucide-react';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSdk, setActiveSdk] = useState('python');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            
            {/* Background Glow Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center">
                <div className="absolute top-[-10%] w-[800px] h-[400px] rounded-[100%] bg-cyan-900/20 blur-[120px] opacity-50"></div>
                <div className="absolute top-[20%] w-[600px] h-[600px] rounded-[100%] bg-indigo-900/10 blur-[150px] opacity-50"></div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#0B1120]/90 backdrop-blur-md border-slate-800/60 shadow-lg py-3' : 'bg-transparent border-transparent py-5'}`}>
                <div className="max-w-6xl mx-auto px-6 flex justify-between items-center w-full">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 p-[1px]">
                            <div className="w-full h-full bg-[#0B1120] rounded-lg flex items-center justify-center">
                                <img src="/logo.png" alt="Decarabian" className="w-5 h-5 object-contain" />
                            </div>
                        </div>
                        <span className="font-heading font-bold text-slate-50 uppercase tracking-widest text-sm sm:text-base">Decarabian</span>
                    </div>
                    
                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 sm:gap-8 text-sm font-medium">
                        <Link to="/docs" className="text-slate-400 hover:text-slate-50 transition-colors hidden md:block">Documentation</Link>
                        <a href="https://github.com/DoramiDoraNobi/decarabian" className="text-slate-400 hover:text-slate-50 transition-colors hidden md:block">GitHub</a>
                        <Link to="/login" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-50 text-[#0B1120] hover:bg-cyan-400 transition-colors font-bold shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] whitespace-nowrap">
                            Launch Console
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-24 md:pt-32 pb-16">
                
                {/* 1. Hero Section */}
                <section className="px-6 flex flex-col items-center text-center max-w-5xl mx-auto animate-fadeIn mt-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700/50 text-xs font-medium text-cyan-400 mb-8 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        Decarabian v1.0 is live
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-slate-50 font-heading leading-[1.1] tracking-tighter mb-6">
                        Never give an AI <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-indigo-400">your real API keys.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
                        A transparent proxy layer for AI tools. Store your real API keys in an encrypted vault, issue scoped tokens to your AI, and let Decarabian handle secret injection and execution logging.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-cyan-500 text-[#0B1120] font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-2">
                            Deploy Gateway <ArrowRight className="w-4 h-4 shrink-0" />
                        </Link>
                        <Link to="/docs" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-800/50 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                            <Terminal className="w-4 h-4 shrink-0" /> Read Docs
                        </Link>
                    </div>
                </section>

                {/* SDK Preview */}
                <section className="px-4 md:px-6 mt-16 md:mt-24 max-w-4xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    <div className="rounded-2xl p-[1px] bg-gradient-to-b from-slate-700/50 to-slate-900/50 shadow-2xl">
                        <div className="bg-[#0A0F1C] rounded-2xl overflow-hidden backdrop-blur-xl">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-[#0F172A]/80">
                                <div className="flex gap-2 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
                                </div>
                                <div className="flex bg-[#05080F] rounded-lg p-1 border border-slate-800/50">
                                    <button 
                                        onClick={() => setActiveSdk('python')}
                                        className={`px-4 py-1.5 text-xs font-mono rounded-md transition-all ${activeSdk === 'python' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        agent.py
                                    </button>
                                    <button 
                                        onClick={() => setActiveSdk('npm')}
                                        className={`px-4 py-1.5 text-xs font-mono rounded-md transition-all ${activeSdk === 'npm' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        agent.ts
                                    </button>
                                </div>
                                <div className="w-[44px]"></div>
                            </div>
                            <div className="p-6 md:p-8 text-sm md:text-base font-mono leading-relaxed overflow-x-auto">
                                {activeSdk === 'python' ? (
                                    <div className="text-slate-300 whitespace-pre">
                                        <span className="text-slate-500"># 1. Initialize Decarabian Gateway</span><br/>
                                        <span className="text-indigo-400">from</span> decarabian <span className="text-indigo-400">import</span> Decarabian<br/>
                                        <br/>
                                        gateway = Decarabian(token=<span className="text-cyan-300">"ag_prod_9XyZ..."</span>)<br/>
                                        <br/>
                                        <span className="text-slate-500"># 2. Agent executes a tool. The real API key is injected server-side.</span><br/>
                                        result = gateway.execute(<br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;tool_name=<span className="text-cyan-300">"stripe.charge"</span>,<br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;parameters=&#123;<span className="text-cyan-300">"amount"</span>: <span className="text-emerald-400">5000</span>, <span className="text-cyan-300">"currency"</span>: <span className="text-cyan-300">"usd"</span>&#125;<br/>
                                        )<br/>
                                    </div>
                                ) : (
                                    <div className="text-slate-300 whitespace-pre">
                                        <span className="text-slate-500">// 1. Initialize Decarabian Gateway</span><br/>
                                        <span className="text-indigo-400">import</span> &#123; Decarabian &#125; <span className="text-indigo-400">from</span> <span className="text-cyan-300">'decarabian'</span>;<br/>
                                        <br/>
                                        <span className="text-indigo-400">const</span> gateway = <span className="text-indigo-400">new</span> Decarabian(&#123; token: <span className="text-cyan-300">'ag_prod_9XyZ...'</span> &#125;);<br/>
                                        <br/>
                                        <span className="text-slate-500">// 2. Agent executes a tool. The real API key is injected server-side.</span><br/>
                                        <span className="text-indigo-400">const</span> result = <span className="text-indigo-400">await</span> gateway.execute(<br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-300">"stripe.charge"</span>, <br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&#123; amount: <span className="text-emerald-400">5000</span>, currency: <span className="text-cyan-300">'usd'</span> &#125;<br/>
                                        );<br/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Bento Grid Features */}
                <section className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-50 font-heading mb-6 tracking-tight">Architected for Paranoia.</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Stop pasting raw API keys into LLM prompts. Decarabian physically separates your secrets from the execution layer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-b from-[#0F172A] to-[#0B1120] p-8 rounded-2xl border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Lock className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 font-heading mb-3">Encrypted Vault</h3>
                            <p className="text-slate-400 leading-relaxed">Your Stripe and AWS keys are encrypted at rest with AES-256. The AI agent never sees the actual keys, only its own token.</p>
                        </div>

                        <div className="bg-gradient-to-b from-[#0F172A] to-[#0B1120] p-8 rounded-2xl border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 font-heading mb-3">Granular Permissions</h3>
                            <p className="text-slate-400 leading-relaxed">Limit agents to specific endpoints. An agent can be permitted to read metrics, but completely blocked from dropping tables.</p>
                        </div>

                        <div className="bg-gradient-to-b from-[#0F172A] to-[#0B1120] p-8 rounded-2xl border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 group md:col-span-2 lg:col-span-1">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Activity className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 font-heading mb-3">Audit Logging</h3>
                            <p className="text-slate-400 leading-relaxed">Every single request the AI makes is recorded. See exactly what parameters were sent and what the target API replied in real-time.</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer with Ko-fi Support Section */}
            <footer className="border-t border-slate-800/60 bg-[#070B14] py-12 relative z-10">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Creator Profile */}
                    <div className="flex items-center gap-4">
                        <img 
                            src="https://github.com/DoramiDoraNobi.png" 
                            alt="DoramiDoraNobi Profile" 
                            className="w-14 h-14 rounded-full border-2 border-slate-700 shadow-lg object-cover"
                            onError={(e) => {e.target.src = '/logo.png'}} // Fallback to logo if GitHub avatar fails
                        />
                        <div className="text-left">
                            <h4 className="text-slate-200 font-bold font-heading text-lg">DoramiDoraNobi</h4>
                            <p className="text-slate-500 text-sm">Creator of Decarabian</p>
                        </div>
                    </div>

                    {/* Ko-fi Button */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <a 
                            href="https://ko-fi.com/doramidoranobi" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group flex items-center gap-3 px-6 py-3 bg-[#FF5E5B]/10 hover:bg-[#FF5E5B]/20 border border-[#FF5E5B]/40 text-[#FF5E5B] rounded-full transition-all shadow-[0_0_15px_rgba(255,94,91,0.1)] hover:shadow-[0_0_25px_rgba(255,94,91,0.25)]"
                        >
                            <Coffee className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold tracking-wide">Buy me a coffee</span>
                        </a>
                        <p className="text-slate-600 text-xs text-center md:text-right max-w-xs">
                            Decarabian is 100% open-source. If this gateway saves your API keys, consider supporting its development!
                        </p>
                    </div>

                </div>
                
                <div className="max-w-5xl mx-auto px-6 mt-10 pt-6 border-t border-slate-800/50 text-center flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs">
                    <p>© 2026 Decarabian Gateway. Built for the autonomous future.</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <Link to="/docs" className="hover:text-slate-300 transition-colors">Documentation</Link>
                        <a href="https://github.com/DoramiDoraNobi/decarabian" className="hover:text-slate-300 transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
