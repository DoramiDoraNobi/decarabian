<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Agent extends Authenticatable
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'agent_token',
        'is_active',
        'rate_limit',
    ];

    protected $hidden = [
        'agent_token',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'rate_limit' => 'integer',
        ];
    }

    // ── Relationships ──

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tools(): BelongsToMany
    {
        return $this->belongsToMany(Tool::class, 'agent_tool')
                    ->withTimestamps();
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    // ── Helpers ──

    /**
     * Check if this agent has permission to use a given tool.
     */
    public function hasPermission(string $toolName): bool
    {
        return $this->tools()
                    ->where('name', $toolName)
                    ->where('is_active', true)
                    ->exists();
    }

    /**
     * Scope to only active agents.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
