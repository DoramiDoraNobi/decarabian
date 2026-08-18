import os
import requests
from typing import Dict, Any, List, Optional
from .exceptions import DecarabianError, UnauthorizedError, ForbiddenError, ToolNotFoundError, GatewayError

class Decarabian:
    """
    Decarabian Agent Gateway Client.
    Connects your AI Agent to the Decarabian infrastructure securely.
    """

    def __init__(self, token: Optional[str] = None, base_url: Optional[str] = None):
        """
        Initialize the Decarabian client.
        
        Args:
            token: The agent token. Defaults to DECARABIAN_AGENT_TOKEN environment variable.
            base_url: The Decarabian API URL. Defaults to DECARABIAN_BASE_URL or http://localhost:8000/api/v1.
        """
        self.token = token or os.environ.get("DECARABIAN_AGENT_TOKEN")
        if not self.token:
            raise ValueError("Decarabian agent token is required. Pass it via token=... or set DECARABIAN_AGENT_TOKEN env var.")

        self.base_url = base_url or os.environ.get("DECARABIAN_BASE_URL", "http://localhost:8000/api/v1")
        self.base_url = self.base_url.rstrip("/")

        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        })

    def _handle_response(self, response: requests.Response) -> Dict[str, Any]:
        try:
            data = response.json()
        except ValueError:
            raise DecarabianError(f"Unexpected response from gateway: {response.text}")

        if response.status_code >= 400:
            error_msg = data.get("message", "Unknown error")
            
            if response.status_code == 401:
                raise UnauthorizedError(error_msg)
            elif response.status_code == 403:
                raise ForbiddenError(error_msg)
            elif response.status_code == 404:
                raise ToolNotFoundError(error_msg)
            elif response.status_code == 502:
                raise GatewayError(f"Target API Error: {error_msg} | Details: {data.get('data', '')}")
            else:
                # E.g. Rate limit 429
                raise DecarabianError(f"HTTP {response.status_code}: {error_msg}")

        return data

    def get_tools(self) -> List[Dict[str, Any]]:
        """
        Fetch all tools that this agent is permitted to use.
        Useful for feeding directly into LLM function calling schemas.
        """
        url = f"{self.base_url}/gateway/tools"
        response = self.session.get(url)
        data = self._handle_response(response)
        return data.get("tools", [])

    def execute(self, tool_name: str, parameters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute a tool safely through the Decarabian gateway.
        
        Args:
            tool_name: The name of the registered tool (e.g. 'github.create_issue')
            parameters: The JSON payload required by the target API.
            
        Returns:
            The response from the target API.
        """
        url = f"{self.base_url}/gateway/execute"
        payload = {
            "tool_name": tool_name,
            "parameters": parameters or {}
        }
        
        response = self.session.post(url, json=payload)
        data = self._handle_response(response)
        
        return data.get("data", data)
