<?php

use App\Http\Controllers\Api\V1\AgentController;
use App\Http\Controllers\Api\V1\AuditLogController;
use App\Http\Controllers\Api\V1\CredentialController;
use App\Http\Controllers\Api\V1\GatewayController;
use App\Http\Controllers\Api\V1\ToolController;
use App\Http\Middleware\AgentRateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Agent Gateway API — two route groups:
| 1. Gateway endpoint: authenticated by Agent Token
| 2. Admin endpoints: authenticated by Sanctum (User Token)
|
*/

// ─── Auth: Register & Login (Public) ─────────────────────────────────────────

Route::prefix('v1/auth')->group(function () {
    Route::post('/register', function (Request $request) {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = \App\Models\User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'data'  => $user->only('id', 'name', 'email'),
            'token' => $token,
        ], 201);
    });

    Route::post('/login', function (Request $request) {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])->first();

        if (!$user || !\Illuminate\Support\Facades\Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'error'   => 'Unauthorized',
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'data'  => $user->only('id', 'name', 'email'),
            'token' => $token,
        ]);
    });
});


// ─── Gateway Endpoint (Agent-authenticated) ─────────────────────────────────

Route::prefix('v1/gateway')->middleware(['auth:agent', AgentRateLimiter::class])->group(function () {
    Route::get('/tools', [GatewayController::class, 'tools']);
    Route::post('/execute', [GatewayController::class, 'execute']);
});


// ─── Admin API (Sanctum-authenticated) ───────────────────────────────────────

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Current user
    Route::get('/user', fn (Request $request) => response()->json(['data' => $request->user()]));

    // Agents CRUD
    Route::apiResource('agents', AgentController::class);
    Route::post('agents/{id}/regenerate-token', [AgentController::class, 'regenerateToken']);
    Route::post('agents/{id}/tools', [AgentController::class, 'syncTools']);

    // Credentials CRUD
    Route::apiResource('credentials', CredentialController::class);

    // Tools CRUD
    Route::apiResource('tools', ToolController::class);
    Route::post('tools/{id}/permissions', [ToolController::class, 'permissions']);

    // Audit Logs (read-only)
    Route::get('audit-logs', [AuditLogController::class, 'index']);
    Route::get('audit-logs/stats', [AuditLogController::class, 'stats']);
    Route::get('audit-logs/{id}', [AuditLogController::class, 'show']);
});
