import { DecarabianError, UnauthorizedError, ForbiddenError, ToolNotFoundError, GatewayError } from './errors';

export interface DecarabianOptions {
    /**
     * The Decarabian Agent Token.
     * Defaults to process.env.DECARABIAN_AGENT_TOKEN
     */
    token?: string;

    /**
     * The Base URL of your Decarabian Gateway.
     * Defaults to process.env.DECARABIAN_BASE_URL or http://localhost:8000/api/v1
     */
    baseUrl?: string;
}

export interface ToolDefinition {
    name: string;
    description?: string;
    parameters_schema?: Record<string, any>;
    [key: string]: any;
}

export class Decarabian {
    private token: string;
    private baseUrl: string;

    constructor(options?: DecarabianOptions) {
        this.token = options?.token || (typeof process !== 'undefined' ? process.env.DECARABIAN_AGENT_TOKEN : undefined) || '';
        if (!this.token) {
            throw new Error("Decarabian agent token is required. Pass it via { token: '...' } or set DECARABIAN_AGENT_TOKEN env var.");
        }

        let defaultUrl = 'http://localhost:8000/api/v1';
        if (typeof process !== 'undefined' && process.env.DECARABIAN_BASE_URL) {
            defaultUrl = process.env.DECARABIAN_BASE_URL;
        }

        this.baseUrl = (options?.baseUrl || defaultUrl).replace(/\/$/, '');
    }

    private async handleResponse(response: Response): Promise<any> {
        let data: any;
        try {
            data = await response.json();
        } catch (e) {
            throw new DecarabianError(`Unexpected response from gateway: ${response.statusText}`);
        }

        if (!response.ok) {
            const errorMsg = data.message || "Unknown error";
            
            switch (response.status) {
                case 401: throw new UnauthorizedError(errorMsg);
                case 403: throw new ForbiddenError(errorMsg);
                case 404: throw new ToolNotFoundError(errorMsg);
                case 502: throw new GatewayError(`Target API Error: ${errorMsg}`, data.data);
                default: throw new DecarabianError(`HTTP ${response.status}: ${errorMsg}`);
            }
        }

        return data;
    }

    /**
     * Fetch all tools that this agent is permitted to use.
     * Useful for feeding directly into LLM function calling schemas (e.g. OpenAI SDK).
     */
    public async getTools(): Promise<ToolDefinition[]> {
        const response = await fetch(`${this.baseUrl}/gateway/tools`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            }
        });

        const data = await this.handleResponse(response);
        return data.tools || [];
    }

    /**
     * Execute a tool safely through the Decarabian gateway.
     * 
     * @param toolName The name of the registered tool (e.g. 'stripe.create_invoice')
     * @param parameters The JSON payload required by the target API
     * @returns The response from the target API
     */
    public async execute<T = any>(toolName: string, parameters: Record<string, any> = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}/gateway/execute`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                tool_name: toolName,
                parameters: parameters
            })
        });

        const data = await this.handleResponse(response);
        return data.data !== undefined ? data.data : data;
    }
}
