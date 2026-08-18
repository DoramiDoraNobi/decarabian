---
name: decarabian-js-sdk
description: Teaches the AI how to use the Decarabian JavaScript/TypeScript SDK to securely call external APIs without requiring real secret keys.
---

# Decarabian AI Agent Skill

This skill teaches you (the AI) how to use the Decarabian SDK in JavaScript/TypeScript projects.

## What is Decarabian?
Decarabian is an AI Security Gateway. As an AI Agent, you **do not** need real API keys (like Stripe, GitHub, or AWS keys) to perform actions. Instead, the user has given you a Decarabian `DECARABIAN_AGENT_TOKEN`. You will use this token to ask Decarabian to execute tools on your behalf. Decarabian holds the real secrets in its vault.

## How to use the Decarabian JS SDK

1. **Initialization:**
   Always initialize the `Decarabian` client. It will automatically read `DECARABIAN_AGENT_TOKEN` from the environment.
   ```typescript
   import { Decarabian, ForbiddenError } from '@decarabian/sdk';
   const gateway = new Decarabian(); // Auto-loads token from process.env
   ```

2. **Discovering Tools:**
   Before executing actions, you can list the tools you have permission to use.
   ```typescript
   const tools = await gateway.getTools();
   console.log("Allowed tools:", tools.map(t => t.name));
   ```

3. **Executing a Tool:**
   To perform an action (e.g., creating a Stripe invoice), call `execute()`. DO NOT look for actual Stripe/GitHub tokens.
   ```typescript
   try {
       const result = await gateway.execute("stripe.create_invoice", {
           customer: "cus_123",
           amount: 50
       });
       console.log("Success:", result);
   } catch (error) {
       if (error instanceof ForbiddenError) {
           console.error("I do not have permission to do this!");
       } else {
           console.error("Error executing tool:", error.message);
       }
   }
   ```

## Rules for AI Agents
- **NEVER** ask the user for their Stripe, GitHub, or AWS Secret Keys.
- If the user asks you to write code to interact with a third-party API, ALWAYS use `gateway.execute("tool_name", params)` instead of writing raw `fetch()` calls or using official SDKs (like `stripe-node`), unless instructed otherwise.
- Handle `ForbiddenError` gracefully by telling the user: "You have not granted me permission for this tool in the Decarabian Dashboard."
