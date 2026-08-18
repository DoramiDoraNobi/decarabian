<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'tool_id',
        'action',
        'http_status',
        'request_payload',
        'response_summary',
        'execution_time_ms',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'request_payload' => 'array',
            'http_status' => 'integer',
            'execution_time_ms' => 'integer',
        ];
    }

    // ── Relationships ──

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function tool(): BelongsTo
    {
        return $this->belongsTo(Tool::class);
    }
}
