<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * List audit logs with filtering support.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with(['agent:id,name', 'tool:id,name'])
            ->latest();

        // Filter by agent
        if ($request->has('agent_id')) {
            $query->where('agent_id', $request->agent_id);
        }

        // Filter by tool
        if ($request->has('tool_id')) {
            $query->where('tool_id', $request->tool_id);
        }

        // Filter by HTTP status (e.g., only errors)
        if ($request->has('status')) {
            $status = $request->status;
            if ($status === 'error') {
                $query->where('http_status', '>=', 400);
            } elseif ($status === 'success') {
                $query->where('http_status', '<', 400);
            } else {
                $query->where('http_status', (int) $status);
            }
        }

        // Filter by date range
        if ($request->has('from')) {
            $query->where('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->where('created_at', '<=', $request->to);
        }

        $logs = $query->paginate($request->get('per_page', 50));

        return response()->json($logs);
    }

    /**
     * Show a single audit log entry.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $log = AuditLog::with(['agent:id,name', 'tool:id,name'])
            ->findOrFail($id);

        return response()->json([
            'data' => $log,
        ]);
    }

    /**
     * Get summary statistics for the dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        $hours = $request->get('hours', 24);
        $since = now()->subHours($hours);

        $totalRequests = AuditLog::where('created_at', '>=', $since)->count();
        $errorRequests = AuditLog::where('created_at', '>=', $since)
            ->where('http_status', '>=', 400)
            ->count();
        $avgExecutionTime = AuditLog::where('created_at', '>=', $since)
            ->whereNotNull('execution_time_ms')
            ->avg('execution_time_ms');

        return response()->json([
            'data' => [
                'period_hours'         => $hours,
                'total_requests'       => $totalRequests,
                'error_requests'       => $errorRequests,
                'error_rate'           => $totalRequests > 0
                    ? round(($errorRequests / $totalRequests) * 100, 2)
                    : 0,
                'avg_execution_time_ms'=> $avgExecutionTime ? round($avgExecutionTime) : 0,
            ],
        ]);
    }
}
