<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class AgentRateLimiter
{
    /**
     * Handle an incoming request.
     * Rate limits are per-agent, using Cache for fast atomic counting.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $agent = $request->user('agent');

        if (!$agent) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid or missing agent token.',
            ], 401);
        }

        $key = "agent_rate_limit:{$agent->id}";
        $limit = $agent->rate_limit ?? 60;
        $windowSeconds = 60;

        $current = Cache::get($key, 0);

        if ($current >= $limit) {
            return response()->json([
                'error' => 'Too Many Requests',
                'message' => "Rate limit exceeded. Max {$limit} requests per minute.",
                'retry_after' => $windowSeconds,
            ], 429);
        }

        // Increment counter, set TTL on first request in window
        if ($current === 0) {
            Cache::put($key, 1, $windowSeconds);
        } else {
            Cache::increment($key);
        }

        return $next($request);
    }
}
