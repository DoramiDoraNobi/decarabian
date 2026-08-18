<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AgentController extends Controller
{
    /**
     * List all agents for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $agents = $request->user()->agents()
            ->withCount('tools')
            ->latest()
            ->get();

        return response()->json([
            'data' => $agents->map(fn (Agent $agent) => [
                'id'          => $agent->id,
                'name'        => $agent->name,
                'description' => $agent->description,
                'is_active'   => $agent->is_active,
                'rate_limit'  => $agent->rate_limit,
                'tools_count' => $agent->tools_count,
                'created_at'  => $agent->created_at,
            ]),
        ]);
    }

    /**
     * Create a new agent.
     * The plain-text token is returned ONLY during creation.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'rate_limit'  => 'nullable|integer|min:1|max:10000',
        ]);

        // Generate a unique plain-text token
        $plainToken = 'ag_' . Str::random(48);

        $agent = $request->user()->agents()->create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'agent_token' => Hash::make($plainToken),
            'is_active'   => true,
            'rate_limit'  => $validated['rate_limit'] ?? 60,
        ]);

        $agent->refresh();

        return response()->json([
            'data' => [
                'id'          => $agent->id,
                'name'        => $agent->name,
                'description' => $agent->description,
                'is_active'   => $agent->is_active,
                'rate_limit'  => $agent->rate_limit,
                'created_at'  => $agent->created_at,
            ],
            'plain_token' => $plainToken,
            'warning'     => 'Store this token securely. It will NOT be shown again.',
        ], 201);
    }

    /**
     * Show a single agent.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $agent = $request->user()->agents()
            ->with('tools:id,name,http_method,target_url,is_active')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id'          => $agent->id,
                'name'        => $agent->name,
                'description' => $agent->description,
                'is_active'   => $agent->is_active,
                'rate_limit'  => $agent->rate_limit,
                'tools'       => $agent->tools,
                'created_at'  => $agent->created_at,
                'updated_at'  => $agent->updated_at,
            ],
        ]);
    }

    /**
     * Update an agent.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $agent = $request->user()->agents()->findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active'   => 'sometimes|boolean',
            'rate_limit'  => 'sometimes|integer|min:1|max:10000',
        ]);

        $agent->update($validated);

        return response()->json([
            'data' => [
                'id'          => $agent->id,
                'name'        => $agent->name,
                'description' => $agent->description,
                'is_active'   => $agent->is_active,
                'rate_limit'  => $agent->rate_limit,
                'updated_at'  => $agent->updated_at,
            ],
        ]);
    }

    /**
     * Delete an agent.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $agent = $request->user()->agents()->findOrFail($id);
        $agent->delete();

        return response()->json([
            'message' => "Agent '{$agent->name}' has been deleted.",
        ]);
    }

    /**
     * Regenerate an agent's token.
     * Returns the new plain-text token (shown only once).
     */
    public function regenerateToken(Request $request, string $id): JsonResponse
    {
        $agent = $request->user()->agents()->findOrFail($id);

        $plainToken = 'ag_' . Str::random(48);
        $agent->update([
            'agent_token' => Hash::make($plainToken),
        ]);

        return response()->json([
            'data' => [
                'id'   => $agent->id,
                'name' => $agent->name,
            ],
            'plain_token' => $plainToken,
            'warning'     => 'Store this token securely. It will NOT be shown again.',
        ]);
    }

    /**
     * Sync permitted tools for the agent.
     */
    public function syncTools(Request $request, string $id): JsonResponse
    {
        $agent = $request->user()->agents()->findOrFail($id);

        $validated = $request->validate([
            'tool_ids'   => 'present|array',
            'tool_ids.*' => 'exists:tools,id',
        ]);

        // Verify the tools actually belong to the authenticated user
        $validTools = $request->user()->tools()->whereIn('id', $validated['tool_ids'])->pluck('id');

        $agent->tools()->sync($validTools);

        return response()->json([
            'message' => "Permissions updated successfully.",
            'tools'   => $agent->tools()->get(['id', 'name']),
        ]);
    }
}
