<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\ProxyService;
use App\Jobs\ProcessAuditLog;
use Illuminate\Support\Facades\Log;

class GatewayController extends Controller
{
    protected $proxyService;

    public function __construct(ProxyService $proxyService)
    {
        $this->proxyService = $proxyService;
    }

    /**
     * Get the list of tools available to the authenticated agent.
     * This is crucial for LLMs to know what tools they can use (Function Calling).
     */
    public function tools(Request $request): JsonResponse
    {
        $agent = $request->user('agent');

        if (!$agent) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Only return tools that are active and assigned to this agent
        $tools = $agent->tools()->where('tools.is_active', true)->get();

        $formattedTools = $tools->map(function ($tool) {
            return [
                'name' => $tool->name,
                'description' => $tool->description,
                'parameters' => $tool->parameters_schema,
            ];
        });

        return response()->json([
            'tools' => $formattedTools
        ]);
    }

    /**
     * Execute a tool on behalf of the agent.
     */
    public function execute(Request $request): JsonResponse
    {
        $agent = $request->user('agent');

        if (!$agent) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'tool_name'  => 'required|string',
            'parameters' => 'nullable|array',
        ]);

        $toolName = $validated['tool_name'];
        $parameters = $validated['parameters'] ?? [];

        // 1. Permission Check
        if (!$agent->hasPermission($toolName)) {
            $this->logAudit($agent->id, null, "Execute {$toolName}", 403, $parameters, ['error' => 'Permission Denied']);
            
            return response()->json([
                'error' => 'Forbidden',
                'message' => "Agent does not have permission to use tool '{$toolName}'."
            ], 403);
        }

        // 2. Fetch Tool
        $tool = $agent->tools()->where('name', $toolName)->first();

        if (!$tool) {
            $this->logAudit($agent->id, null, "Execute {$toolName}", 404, $parameters, ['error' => 'Tool Not Found']);
            
            return response()->json([
                'error' => 'Not Found',
                'message' => "Tool '{$toolName}' does not exist."
            ], 404);
        }

        // 3. Execute Request via Proxy
        $startTime = microtime(true);
        $status = 500;
        $responseSummary = 'Internal Error';
        
        try {
            $response = $this->proxyService->forward($tool, $parameters);
            
            $status = $response->status();
            $responseData = $response->json() ?? $response->body();
            $responseSummary = json_encode($responseData);

            $this->logAudit($agent->id, $tool->id, "Execute {$toolName}", $status, $parameters, $responseSummary, $startTime);

            return response()->json([
                'success' => $response->successful(),
                'status'  => $status,
                'data'    => $responseData
            ], $status);

        } catch (\Exception $e) {
            $responseSummary = $e->getMessage();
            $this->logAudit($agent->id, $tool->id, "Execute {$toolName}", 502, $parameters, $responseSummary, $startTime);

            return response()->json([
                'error' => 'Gateway Error',
                'message' => 'Failed to forward request to target API: ' . $e->getMessage()
            ], 502);
        }
    }

    protected function logAudit($agentId, $toolId, $action, $status, $payload, $summary, $startTime = null)
    {
        $executionTime = $startTime ? round((microtime(true) - $startTime) * 1000, 2) : 0;

        ProcessAuditLog::dispatch([
            'agent_id'         => $agentId,
            'tool_id'          => $toolId,
            'action'           => $action,
            'http_status'      => $status,
            'request_payload'  => json_encode($payload),
            'response_summary' => is_string($summary) ? substr($summary, 0, 1000) : json_encode($summary),
            'execution_time_ms'=> $executionTime,
        ]);
    }
}
