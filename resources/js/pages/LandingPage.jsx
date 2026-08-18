import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Clipboard,
    Cloud,
    Database,
    Eye,
    FileText,
    Gauge,
    GitBranch,
    Key,
    Layers,
    Lock,
    PackageCheck,
    Rocket,
    Server,
    Shield,
    Terminal,
    Users,
} from 'lucide-react';

const metrics = [
    { label: 'Policy checks', value: '2.4M', tone: 'text-emerald-300' },
    { label: 'Avg gateway latency', value: '84ms', tone: 'text-cyan-300' },
    { label: 'Keys exposed to agents', value: '0', tone: 'text-amber-300' },
];

const features = [
    {
        icon: Lock,
        title: 'Credential vault',
        body: 'Store provider secrets once, encrypt them at rest, and inject them only when a permitted tool call is executed.',
        accent: 'text-amber-300 bg-amber-300/10 border-amber-300/20',
    },
    {
        icon: Shield,
        title: 'Agent-scoped policy',
        body: 'Issue tokens per agent, bind them to exact tools, and keep rate limits separate from your real upstream API keys.',
        accent: 'text-cyan-300 bg-cyan-300/10 border-cyan-300/20',
    },
    {
        icon: Activity,
        title: 'Forensic audit trail',
        body: 'Every request, parameter, response state, and execution time is captured so teams can review agent activity later.',
        accent: 'text-emerald-300 bg-emerald-300/10 border-emerald-300/20',
    },
];

const flowSteps = [
    {
        title: 'Agent calls a tool',
        body: 'The agent sends a scoped token plus the requested action, never a production credential.',
        icon: Terminal,
    },
    {
        title: 'Gateway validates policy',
        body: 'Decarabian checks the agent, tool permissions, method, target URL, and request limits.',
        icon: GitBranch,
    },
    {
        title: 'Secret is injected server-side',
        body: 'The matching credential is decrypted only for the outgoing request and never returned to the agent.',
        icon: Key,
    },
    {
        title: 'Response is logged',
        body: 'Execution result, timing, and status are written into an audit trail for operators.',
        icon: FileText,
    },
];

const installCommands = [
    {
        label: 'JavaScript / TypeScript',
        command: 'npm install @decarabian/sdk',
        env: 'export DECARABIAN_AGENT_TOKEN="ag_live_..."',
        code: `import { Decarabian } from '@decarabian/sdk';

const gateway = new Decarabian();
const result = await gateway.execute('stripe.create_invoice', {
  customer: 'cus_123',
  amount: 5000
});`,
    },
    {
        label: 'Python',
        command: 'pip install decarabian',
        env: 'export DECARABIAN_AGENT_TOKEN="ag_live_..."',
        code: `from decarabian import Decarabian

gateway = Decarabian()
result = gateway.execute(
    "github.create_issue",
    {"title": "Payment bug", "body": "Checkout failed"}
)`,
    },
];

const freeChecks = [
    'No billing tables or subscription logic in the current codebase.',
    'Self-hosted Laravel, React, and SDK packages are already in the project.',
    'Agent rate limits exist, but they are operational limits, not paid quotas.',
];

const roadmapItems = [
    {
        phase: 'Now',
        title: 'Core gateway foundation',
        body: 'Credential vault, agent tokens, tool registry, permissions, rate limits, gateway execution, audit logs, and local SDKs.',
        icon: Layers,
    },
    {
        phase: 'Next',
        title: 'Developer onboarding',
        body: 'Published SDK packages, copy-token onboarding, richer docs, tool schema helpers, and quick templates for common APIs.',
        icon: PackageCheck,
    },
    {
        phase: 'Team',
        title: 'Production controls',
        body: 'Roles, environments, secret rotation, policy templates, alerting, approval flows, and audit export for reviews.',
        icon: Users,
    },
    {
        phase: 'Cloud',
        title: 'Managed Decarabian',
        body: 'Hosted gateway option, usage analytics, managed upgrades, organization billing, and deployment health monitoring.',
        icon: Cloud,
    },
];

const auditRows = [
    ['stripe.charge', 'checkout-agent', 'allowed', '78ms'],
    ['github.issue', 'release-agent', 'allowed', '102ms'],
    ['aws.delete_bucket', 'ops-agent', 'blocked', '12ms'],
    ['notion.page', 'research-agent', 'allowed', '66ms'],
];

function StatusPill({ state }) {
    const blocked = state === 'blocked';
    return (
        <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold uppercase ${blocked ? 'bg-rose-400/10 text-rose-200' : 'bg-emerald-400/10 text-emerald-200'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${blocked ? 'bg-rose-300' : 'bg-emerald-300'}`}></span>
            {state}
        </span>
    );
}

function GatewayVisual() {
    return (
        <div className="relative mx-auto mt-14 w-full max-w-6xl lg:mt-12">
            <div className="absolute -inset-x-4 top-14 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"></div>
            <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr_0.72fr] lg:items-center">
                <div className="decarabian-reveal rounded-lg border border-white/10 bg-[#171a1c]/85 p-4 shadow-2xl backdrop-blur" style={{ animationDelay: '0.08s' }}>
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-zinc-400">Agent token</span>
                        <span className="rounded bg-cyan-300/10 px-2 py-1 text-[11px] font-semibold text-cyan-200">scoped</span>
                    </div>
                    <div className="space-y-3 font-mono text-xs text-zinc-300">
                        <div className="flex items-center justify-between rounded border border-white/10 bg-black/20 px-3 py-2">
                            <span>checkout-agent</span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        </div>
                        <div className="rounded border border-cyan-300/20 bg-cyan-300/5 px-3 py-2 text-cyan-100">tool: stripe.charge</div>
                        <div className="rounded border border-white/10 bg-black/20 px-3 py-2 text-zinc-500">token: ag_live_9x...</div>
                    </div>
                </div>

                <div className="decarabian-console decarabian-reveal overflow-hidden rounded-lg border border-white/10 bg-[#0d0f10] shadow-2xl" style={{ animationDelay: '0.18s' }}>
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-300/70"></span>
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70"></span>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70"></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                            <Shield className="h-4 w-4 text-cyan-300" />
                            Gateway control plane
                        </div>
                    </div>

                    <div className="grid gap-0 md:grid-cols-[0.7fr_1.3fr]">
                        <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
                            <p className="mb-4 text-xs font-semibold uppercase text-zinc-500">Live posture</p>
                            <div className="space-y-4">
                                {metrics.map((item) => (
                                    <div key={item.label}>
                                        <div className={`text-2xl font-bold ${item.tone}`}>{item.value}</div>
                                        <div className="mt-1 text-xs text-zinc-500">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative p-5">
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 decarabian-scan"></div>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white">Request audit</p>
                                    <p className="text-xs text-zinc-500">policy, credential, latency</p>
                                </div>
                                <span className="rounded bg-emerald-300/10 px-2 py-1 text-xs font-semibold text-emerald-200">operational</span>
                            </div>
                            <div className="space-y-2">
                                {auditRows.map(([tool, agent, status, time], index) => (
                                    <div
                                        key={tool}
                                        className="decarabian-row grid grid-cols-[1.1fr_0.95fr_0.72fr_0.45fr] items-center gap-2 rounded border border-white/10 bg-white/[0.035] px-3 py-2 text-xs"
                                        style={{ animationDelay: `${0.36 + index * 0.12}s` }}
                                    >
                                        <span className="truncate font-mono text-zinc-200">{tool}</span>
                                        <span className="truncate text-zinc-500">{agent}</span>
                                        <StatusPill state={status} />
                                        <span className="text-right font-mono text-zinc-400">{time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="decarabian-reveal rounded-lg border border-white/10 bg-[#171a1c]/85 p-4 shadow-2xl backdrop-blur" style={{ animationDelay: '0.28s' }}>
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-zinc-400">Credential vault</span>
                        <Lock className="h-4 w-4 text-amber-300" />
                    </div>
                    <div className="space-y-3">
                        {['Stripe API', 'GitHub PAT', 'AWS Access'].map((secret, index) => (
                            <div key={secret} className="rounded border border-white/10 bg-black/20 p-3">
                                <div className="mb-2 flex items-center justify-between text-sm text-zinc-200">
                                    <span>{secret}</span>
                                    <span className="h-2 w-2 rounded-full bg-emerald-300 decarabian-pulse" style={{ animationDelay: `${index * 0.25}s` }}></span>
                                </div>
                                <div className="h-2 rounded bg-zinc-800">
                                    <div className="h-full w-2/3 rounded bg-gradient-to-r from-zinc-600 to-zinc-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navText = scrolled ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-300 hover:text-white';
    const brandText = scrolled ? 'text-zinc-950' : 'text-white';

    return (
        <div className="min-h-screen bg-[#f4f1ea] text-zinc-900 font-sans selection:bg-cyan-300/40">
            <nav className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-zinc-200 bg-[#f4f1ea]/90 py-3 shadow-sm backdrop-blur-xl' : 'border-transparent bg-transparent py-5'}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <span className={`grid h-9 w-9 place-items-center rounded-md border bg-zinc-950 ${scrolled ? 'border-zinc-800' : 'border-white/10'}`}>
                            <img src="/logo.png" alt="Decarabian" className="h-5 w-5 object-contain" />
                        </span>
                        <span className={`font-heading text-base font-bold tracking-normal ${brandText}`}>Decarabian</span>
                    </Link>

                    <div className={`hidden items-center gap-6 text-sm font-semibold md:flex ${navText}`}>
                        <a href="#developer">Developer</a>
                        <a href="#platform">Platform</a>
                        <a href="#workflow">Workflow</a>
                        <a href="#free">Free</a>
                        <a href="#roadmap">Roadmap</a>
                        <Link to="/docs">Docs</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/login" className={`hidden rounded-md px-4 py-2 text-sm font-semibold transition sm:inline-flex ${scrolled ? 'text-zinc-700 hover:bg-zinc-900/5' : 'text-zinc-300 hover:bg-white/10 hover:text-white'}`}>
                            Sign in
                        </Link>
                        <Link to="/login" className="inline-flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800">
                            Launch console <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                <section className="relative min-h-[94vh] overflow-hidden bg-[#111315] px-5 pb-12 pt-28 text-white sm:px-6 lg:px-8">
                    <div className="absolute inset-0 decarabian-grid"></div>
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f4f1ea] to-transparent"></div>

                    <div className="relative mx-auto max-w-7xl">
                        <div className="mx-auto max-w-4xl text-center decarabian-reveal">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase text-zinc-300 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-emerald-300 decarabian-pulse"></span>
                                Zero-secret execution for autonomous agents
                            </div>
                            <h1 className="font-heading text-4xl font-bold leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
                                Run AI agents without handing them your production keys.
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                                Decarabian is a security gateway for agentic systems. Put credentials in a vault, expose only approved tools, and inspect every request before it touches your real APIs.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link to="/login" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-200 sm:w-auto">
                                    Secure an agent <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link to="/docs" className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08] sm:w-auto">
                                    <Terminal className="h-4 w-4" /> View documentation
                                </Link>
                            </div>
                        </div>

                        <GatewayVisual />
                    </div>
                </section>

                <section className="border-b border-zinc-200 bg-[#f4f1ea] px-5 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
                        {metrics.map((item) => (
                            <div key={item.label} className="rounded-lg border border-zinc-200 bg-white/60 p-5">
                                <div className="text-3xl font-bold text-zinc-950">{item.value}</div>
                                <div className="mt-1 text-sm font-medium text-zinc-500">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="developer" className="border-b border-zinc-200 bg-white px-5 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
                            <div>
                                <p className="text-sm font-bold uppercase text-cyan-700">Section 1: Developer quickstart</p>
                                <h2 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-normal text-zinc-950 sm:text-4xl">
                                    Install the SDK, set an agent token, execute a tool.
                                </h2>
                                <p className="mt-5 text-base leading-8 text-zinc-600">
                                    The app already includes local JavaScript and Python SDK packages. This section gives developers copy-ready commands and the minimum code needed to route agent actions through Decarabian.
                                </p>
                                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                                    <strong>Note:</strong> package names are taken from the current SDK config: <code>@decarabian/sdk</code> for JS/TS and <code>decarabian</code> for Python.
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {installCommands.map((sdk) => (
                                    <article key={sdk.label} className="overflow-hidden rounded-lg border border-zinc-200 bg-[#111315] text-white shadow-sm">
                                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-9 w-9 place-items-center rounded-md bg-cyan-300/10 text-cyan-200">
                                                    <Clipboard className="h-4 w-4" />
                                                </span>
                                                <h3 className="font-heading text-lg font-bold tracking-normal">{sdk.label}</h3>
                                            </div>
                                            <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-300">copy ready</span>
                                        </div>
                                        <div className="space-y-3 p-5">
                                            <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/35 p-4 text-sm text-cyan-100"><code>{sdk.command}</code></pre>
                                            <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/35 p-4 text-sm text-emerald-100"><code>{sdk.env}</code></pre>
                                            <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/35 p-4 text-sm leading-7 text-zinc-200"><code>{sdk.code}</code></pre>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="platform" className="px-5 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                            <div>
                                <p className="text-sm font-bold uppercase text-cyan-700">Platform</p>
                                <h2 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-normal text-zinc-950 sm:text-4xl">
                                    A narrow, inspectable layer between agents and your infrastructure.
                                </h2>
                            </div>
                            <p className="max-w-2xl text-base leading-8 text-zinc-600 lg:ml-auto">
                                The current app already has agents, credential vaults, tool registry, gateway execution, and audit logs. This landing page now presents that core product clearly instead of relying on generic security language.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-4 md:grid-cols-3">
                            {features.map((feature) => (
                                <article key={feature.title} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                                    <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md border ${feature.accent}`}>
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-heading text-xl font-bold tracking-normal text-zinc-950">{feature.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-zinc-600">{feature.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="workflow" className="border-y border-zinc-200 bg-white px-5 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                            <div>
                                <p className="text-sm font-bold uppercase text-emerald-700">Execution workflow</p>
                                <h2 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-normal text-zinc-950 sm:text-4xl">
                                    Permissioned API access in four auditable moves.
                                </h2>
                                <p className="mt-5 text-base leading-8 text-zinc-600">
                                    Designed for teams that want agents to act, but still need operational control, blast-radius limits, and reviewable evidence.
                                </p>
                            </div>

                            <div className="grid gap-3">
                                {flowSteps.map((step, index) => (
                                    <div key={step.title} className="group grid gap-4 rounded-lg border border-zinc-200 bg-[#f9f8f4] p-4 transition hover:border-zinc-300 hover:bg-white sm:grid-cols-[auto_1fr]">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-10 w-10 place-items-center rounded-md bg-zinc-950 text-white">
                                                <step.icon className="h-5 w-5" />
                                            </span>
                                            <span className="font-mono text-xs font-semibold text-zinc-400">0{index + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-lg font-bold tracking-normal text-zinc-950">{step.title}</h3>
                                            <p className="mt-1 text-sm leading-7 text-zinc-600">{step.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="free" className="px-5 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase text-emerald-700">Is Decarabian free?</p>
                            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-normal text-zinc-950 sm:text-4xl">
                                For the current self-hosted build, yes.
                            </h2>
                            <p className="mt-5 text-base leading-8 text-zinc-600">
                                I checked the existing code first: there is no billing module, no subscription table, no payment controller, and no pricing gate. The current product is structured as a self-hosted gateway you run yourself.
                            </p>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-5">
                                <div>
                                    <h3 className="font-heading text-2xl font-bold tracking-normal text-zinc-950">Current edition</h3>
                                    <p className="mt-1 text-sm text-zinc-500">Free self-hosted gateway</p>
                                </div>
                                <span className="rounded-md bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">Free</span>
                            </div>
                            <div className="space-y-3">
                                {freeChecks.map((item) => (
                                    <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-[#f9f8f4] p-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                                        <p className="text-sm leading-6 text-zinc-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-5 text-xs leading-6 text-zinc-500">
                                Future hosted/team editions may add pricing, but that is not implemented in this codebase today.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="roadmap" className="border-y border-zinc-200 bg-white px-5 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-md bg-zinc-950 text-cyan-200">
                                <Rocket className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-bold uppercase text-cyan-700">Roadmap</p>
                            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-normal text-zinc-950 sm:text-4xl">
                                Where Decarabian can grow next.
                            </h2>
                            <p className="mt-5 text-base leading-8 text-zinc-600">
                                The roadmap below is based on what the current app already has and what naturally comes next for an AI gateway moving toward production usage.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {roadmapItems.map((item) => (
                                <article key={item.title} className="rounded-lg border border-zinc-200 bg-[#f9f8f4] p-5 transition hover:border-zinc-300 hover:bg-white">
                                    <div className="mb-5 flex items-center justify-between">
                                        <span className="rounded bg-zinc-950 px-2.5 py-1.5 text-xs font-bold uppercase text-white">{item.phase}</span>
                                        <item.icon className="h-5 w-5 text-cyan-700" />
                                    </div>
                                    <h3 className="font-heading text-lg font-bold tracking-normal text-zinc-950">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-zinc-600">{item.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-5 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
                        <div className="rounded-lg border border-zinc-200 bg-zinc-950 p-6 text-white lg:col-span-2">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                                <div>
                                    <p className="text-sm font-semibold uppercase text-zinc-400">Operational console</p>
                                    <h2 className="mt-2 font-heading text-2xl font-bold tracking-normal">Built for review, not blind trust.</h2>
                                </div>
                                <Eye className="h-6 w-6 text-cyan-300" />
                            </div>
                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {[
                                    ['Vaulted credentials', Database, 'Secrets stay behind the gateway.'],
                                    ['Rate limits', Gauge, 'Each agent gets its own ceiling.'],
                                    ['Audit-ready logs', FileText, 'Every tool call is traceable.'],
                                ].map(([title, Icon, body]) => (
                                    <div key={title} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                        <Icon className="mb-4 h-5 w-5 text-amber-300" />
                                        <h3 className="font-semibold text-white">{title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                            <Server className="mb-5 h-7 w-7 text-emerald-700" />
                            <h2 className="font-heading text-2xl font-bold tracking-normal text-zinc-950">Ready for local deployment.</h2>
                            <p className="mt-3 text-sm leading-7 text-zinc-600">
                                Laravel handles API execution and persistence. React provides the console experience. Vite keeps iteration fast.
                            </p>
                            <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800">
                                Open console <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-zinc-200 bg-[#f4f1ea] px-5 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Decarabian. Security gateway for autonomous execution.</p>
                    <div className="flex gap-5">
                        <Link to="/docs" className="hover:text-zinc-950">Documentation</Link>
                        <Link to="/login" className="hover:text-zinc-950">Console</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
