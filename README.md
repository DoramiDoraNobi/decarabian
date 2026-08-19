<div align="center">
  <img src="public/logo.png" alt="Decarabian Logo" width="120" height="120" />
  <h1>Decarabian</h1>
  <p><strong>A Transparent Proxy and Secret Vault for AI Agents</strong></p>
  <p>Instead of giving raw API keys directly to LLMs, Decarabian acts as a middleman that intercepts tool calls, injects real secrets server-side, and logs every action.</p>
</div>

---

## ?? Support the Project
Decarabian is open-source. If this gateway saves your API keys and your time, consider supporting the creator!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/doramidoranobi)

---

## ⚓ What is Decarabian?

Current Autonomous AI Agents (like AutoGPT, custom LLMs, or Antigravity) require raw API keys (e.g., Stripe, AWS, GitHub) to interact with the world. This creates a massive attack vector. If an AI hallucinates or is compromised via Prompt Injection, it could leak your keys, delete your database, or authorize fraudulent refunds.

**Decarabian solves this by acting as an invisible proxy layer.**

Instead of giving the AI your real API keys, you store them securely inside Decarabian's encrypted vault. You then issue the AI a granular, permission-scoped "Agent Token". When the AI needs to perform an action (e.g., `stripe.charge`), it sends the request to Decarabian. Decarabian validates the permissions, secretly injects the real API key, forwards the request, logs the transaction, and returns the result to the AI.

## 📖 How It Works (The Core Concepts)

To use Decarabian effectively, you need to understand its 3 main pillars:

### 1. 🔐 Credentials (The Vault)
This is where you store your real, sensitive API Keys (e.g., your GitHub PAT, Stripe Secret Key, AWS Credentials). Decarabian encrypts these at rest (AES-256).
- **Rule:** The AI agent *never* sees these credentials.

### 2. 🛠️ Tools (The API Routes)
A "Tool" is simply a mapping to an external API endpoint.
- **Example:** You create a tool named `github.issue.create`.
- **Target URL:** `https://api.github.com/repos/{owner}/{repo}/issues`
- **Method & Auth:** `POST`, linked to your *GitHub PAT* credential.
- **Dynamic Routing:** Decarabian parses `{variables}` in the URL and intelligently injects parameters sent by the AI, making tools highly reusable across different projects.

### 3. 🤖 Agents (The AI Identities)
This is the "ID Card" you give to your AI scripts.
- **Creation:** You create an Agent in the dashboard (e.g., "Customer Support Bot") and Decarabian gives you a local token (`ag_...`).
- **Permissions:** You assign specific *Tools* to this agent. (e.g., The Support Bot is allowed to use `github.issue.create`, but is blocked from `github.repo.delete`).
- **Multi-App Routing:** 1 Agent can be given access to multiple tools across different apps (Stripe + GitHub). The AI only needs to hold its single `ag_...` token, and Decarabian automatically fetches and injects the correct underlying credentials for each tool it calls.

## 🛡️ Is it Safe?

**Yes. Architected for Paranoia.**

- **Encrypted Vault:** Your real API keys (AWS, Stripe, etc.) are encrypted at rest using AES-256 cipher before saving to the database. The AI agent never sees or touches them.
- **Granular Permissions:** An AI token can be restricted to specific endpoints. You can allow an AI to read metrics (`stripe.metrics`) but strictly block it from refunding users (`stripe.refund`).
- **Audit Logging:** Every single request the AI makes is recorded as an immutable Audit Log. You can see the exact parameters the AI sent and what the target API replied.
- **Kill Switches:** If an agent starts behaving erratically, you can revoke its token instantly from the Decarabian console, cutting off its access without needing to cycle your actual Stripe/AWS keys.

## 🏢 Can we Self-Host?

**Absolutely.** In fact, for security infrastructure, **we highly recommend self-hosting.**

Decarabian is an Open-Core platform. We believe that your API keys should never leave your VPC. You can self-host the entire Gateway (Laravel + React dashboard) on your own AWS, DigitalOcean, or local infrastructure (using Docker or basic LEMP/XAMPP stacks).

Once deployed, you simply configure the official Python or JavaScript SDK to point to your self-hosted URL:

```python
# The agent only gets a Decarabian token, not a Stripe key.
gateway = Decarabian(
    base_url="https://gateway.your-company.com", # Your self-hosted URL
    token="ag_prod_9XyZ..."
)
```

## 🚀 Quick Start (SDKs)

Decarabian comes with official SDKs that handle the heavy lifting for your autonomous agents.

### Python SDK
```bash
pip install decarabian
```
```python
from decarabian import Decarabian

gateway = Decarabian(token="ag_...")
result = gateway.execute(
    tool_name="stripe.charge",
    parameters={"amount": 5000, "currency": "usd"}
)
print(result)
```

### TypeScript / JavaScript SDK
```bash
npm install decarabian
```
```typescript
import { Decarabian } from 'decarabian';

const gateway = new Decarabian({ token: 'ag_...' });
const result = await gateway.execute(
    'stripe.charge',
    { amount: 5000, currency: 'usd' }
);
console.log(result);
```

## 🛠️ Built With
- **Backend:** Laravel 11 (PHP)
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
- **SDKs:** Python (requests), TypeScript (fetch)
- **Database:** MySQL / SQLite

## 📄 License
MIT License. Built for the autonomous future.

