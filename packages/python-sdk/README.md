# Decarabian Python SDK

The official Python client for Decarabian - the secure AI Gateway infrastructure.

## Installation

```bash
pip install decarabian
```

## Quick Start

Connect your AI Agent to Decarabian and execute tools securely.

```python
import os
from decarabian import Decarabian, ForbiddenError

# Initialize the gateway
# Make sure to set DECARABIAN_AGENT_TOKEN in your environment variables
gateway = Decarabian()

# 1. Provide tools to your LLM
available_tools = gateway.get_tools()
print("Tools available for this agent:", available_tools)

# 2. Execute a tool securely (The real API keys are injected by the gateway)
try:
    result = gateway.execute(
        tool_name="github.create_issue",
        parameters={
            "title": "Payment Bug",
            "body": "User reported unable to checkout."
        }
    )
    print("Success:", result)
except ForbiddenError:
    print("Permission Denied: Agent is not allowed to use this tool.")
```
