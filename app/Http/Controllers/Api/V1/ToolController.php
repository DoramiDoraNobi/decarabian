<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    /**
     * List all tools.
     */
    public function index(Request $request): JsonResponse
    {
        $tools = Tool::with('credential:id,name,provider')
            ->withCount('agents')
            ->latest()
            ->get();

        return response()->json([
            'data' => $tools->map(fn (Tool $tool) => [
                'id'                => $tool->id,
                'name'              => $tool->name,
                'description'       => $tool->description,
                'target_url'        => $tool->target_url,
                'http_method'       => $tool->http_method,
                'is_active'         => $tool->is_active,
                'credential'        => $tool->credential ? [
                    'id'       => $tool->credential->id,
                    'name'     => $tool->credential->name,
                    'provider' => $tool->credential->provider,
                ] : null,
                'agents_count'      => $tool->agents_count,
                'parameters_schema' => $tool->parameters_schema,
                'created_at'        => $tool->created_at,
            ]),
        ]);
    }

    /**
     * Register a new tool.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'credential_id'     => 'required|uuid|exists:credentials,id',
            'name'              => 'required|string|max:255|unique:tools,name|regex:/^[a-z0-9_]+$/',
            'description'       => 'nullable|string|max:1000',
            'target_url'        => 'required|url|max:2048',
            'http_method'       => 'required|in:GET,POST,PUT,PATCH,DELETE',
            'parameters_schema' => 'nullable|array',
        ]);

        $tool = Tool::create($validated);
        $tool->load('credential:id,name,provider');

        return response()->json([
            'data' => [
                'id'                => $tool->id,
                'name'              => $tool->name,
                'description'       => $tool->description,
                'target_url'        => $tool->target_url,
                'http_method'       => $tool->http_method,
                'is_active'         => $tool->is_active,
                'credential'        => [
                    'id'       => $tool->credential->id,
                    'name'     => $tool->credential->name,
                    'provider' => $tool->credential->provider,
                ],
                'parameters_schema' => $tool->parameters_schema,
                'created_at'        => $tool->created_at,
            ],
        ], 201);
    }

    /**
     * Show a single tool.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $tool = Tool::with(['credential:id,name,provider', 'agents:id,name,is_active'])
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id'                => $tool->id,
                'name'              => $tool->name,
                'description'       => $tool->description,
                'target_url'        => $tool->target_url,
                'http_method'       => $tool->http_method,
                'is_active'         => $tool->is_active,
                'credential'        => $tool->credential ? [
                    'id'       => $tool->credential->id,
                    'name'     => $tool->credential->name,
                    'provider' => $tool->credential->provider,
                ] : null,
                'agents'            => $tool->agents,
                'parameters_schema' => $tool->parameters_schema,
                'created_at'        => $tool->created_at,
                'updated_at'        => $tool->updated_at,
            ],
        ]);
    }

    /**
     * Update a tool.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);

        $validated = $request->validate([
            'credential_id'     => 'sometimes|uuid|exists:credentials,id',
            'name'              => "sometimes|string|max:255|unique:tools,name,{$id}|regex:/^[a-z0-9_]+$/",
            'description'       => 'nullable|string|max:1000',
            'target_url'        => 'sometimes|url|max:2048',
            'http_method'       => 'sometimes|in:GET,POST,PUT,PATCH,DELETE',
            'parameters_schema' => 'nullable|array',
            'is_active'         => 'sometimes|boolean',
        ]);

        $tool->update($validated);

        return response()->json([
            'data' => [
                'id'                => $tool->id,
                'name'              => $tool->name,
                'description'       => $tool->description,
                'target_url'        => $tool->target_url,
                'http_method'       => $tool->http_method,
                'is_active'         => $tool->is_active,
                'parameters_schema' => $tool->parameters_schema,
                'updated_at'        => $tool->updated_at,
            ],
        ]);
    }

    /**
     * Delete a tool.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);
        $tool->delete();

        return response()->json([
            'message' => "Tool '{$tool->name}' has been deleted.",
        ]);
    }

    /**
     * Manage tool permissions — assign or revoke agents.
     */
    public function permissions(Request $request, string $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);

        $validated = $request->validate([
            'agent_ids' => 'required|array',
            'agent_ids.*' => 'uuid|exists:agents,id',
        ]);

        // Sync replaces all existing permissions with the provided list
        $tool->agents()->sync($validated['agent_ids']);

        $tool->load('agents:id,name,is_active');

        return response()->json([
            'data' => [
                'tool_id'   => $tool->id,
                'tool_name' => $tool->name,
                'agents'    => $tool->agents,
            ],
            'message' => 'Permissions updated successfully.',
        ]);
    }
}
