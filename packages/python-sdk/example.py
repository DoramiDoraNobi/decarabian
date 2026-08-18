import os
from decarabian import Decarabian

# Initialize SDK
# Make sure you created an agent in your Decarabian dashboard and copied its token
# Put the token here, or run: set DECARABIAN_AGENT_TOKEN=ag_YourToken
os.environ["DECARABIAN_AGENT_TOKEN"] = "ag_YOUR_TEST_TOKEN_HERE" 

try:
    gateway = Decarabian()
    
    print("Fetching tools...")
    tools = gateway.get_tools()
    
    print("Agent can access the following tools:")
    for t in tools:
        print(f"- {t['name']}: {t.get('description', '')}")

except Exception as e:
    print(f"Error: {e}")
