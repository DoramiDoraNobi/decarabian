<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Credential;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class CredentialController extends Controller
{
    /**
     * List all credentials for the authenticated user.
     * Secrets are NEVER returned.
     */
    public function index(Request $request): JsonResponse
    {
        $credentials = $request->user()->credentials()
            ->withCount('tools')
            ->latest()
            ->get();

        return response()->json([
            'data' => $credentials->map(fn (Credential $cred) => [
                'id'         => $cred->id,
                'name'       => $cred->name,
                'provider'   => $cred->provider,
                'auth_type'  => $cred->auth_type,
                'auth_header_name' => $cred->auth_header_name,
                'tools_count'=> $cred->tools_count,
                'created_at' => $cred->created_at,
            ]),
        ]);
    }

    /**
     * Store a new credential.
     * The secret is encrypted before storage and never shown again.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'provider'         => 'nullable|string|max:100',
            'secret'           => 'required|string',
            'auth_type'        => 'nullable|in:bearer,header,query',
            'auth_header_name' => 'nullable|string|max:255',
        ]);

        $credential = $request->user()->credentials()->create([
            'name'              => $validated['name'],
            'provider'          => $validated['provider'] ?? 'custom',
            'encrypted_secret'  => Crypt::encryptString($validated['secret']),
            'auth_type'         => $validated['auth_type'] ?? 'bearer',
            'auth_header_name'  => $validated['auth_header_name'] ?? null,
        ]);

        return response()->json([
            'data' => [
                'id'               => $credential->id,
                'name'             => $credential->name,
                'provider'         => $credential->provider,
                'auth_type'        => $credential->auth_type,
                'auth_header_name' => $credential->auth_header_name,
                'created_at'       => $credential->created_at,
            ],
            'message' => 'Credential stored securely. The secret will NOT be shown again.',
        ], 201);
    }

    /**
     * Show a single credential (without secret).
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $credential = $request->user()->credentials()
            ->with('tools:id,name,http_method,target_url')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id'               => $credential->id,
                'name'             => $credential->name,
                'provider'         => $credential->provider,
                'auth_type'        => $credential->auth_type,
                'auth_header_name' => $credential->auth_header_name,
                'tools'            => $credential->tools,
                'created_at'       => $credential->created_at,
                'updated_at'       => $credential->updated_at,
            ],
        ]);
    }

    /**
     * Update credential metadata (NOT the secret).
     * To change the secret, delete and recreate the credential.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $credential = $request->user()->credentials()->findOrFail($id);

        $validated = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'provider'         => 'sometimes|string|max:100',
            'auth_type'        => 'sometimes|in:bearer,header,query',
            'auth_header_name' => 'nullable|string|max:255',
            'secret'           => 'nullable|string',
        ]);

        if (!empty($validated['secret'])) {
            $validated['encrypted_secret'] = Crypt::encryptString($validated['secret']);
            unset($validated['secret']);
        }

        $credential->update($validated);

        return response()->json([
            'data' => [
                'id'               => $credential->id,
                'name'             => $credential->name,
                'provider'         => $credential->provider,
                'auth_type'        => $credential->auth_type,
                'auth_header_name' => $credential->auth_header_name,
                'updated_at'       => $credential->updated_at,
            ],
        ]);
    }

    /**
     * Delete a credential (cascades to associated tools).
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $credential = $request->user()->credentials()->findOrFail($id);
        $credential->delete();

        return response()->json([
            'message' => "Credential '{$credential->name}' has been deleted.",
        ]);
    }
}
