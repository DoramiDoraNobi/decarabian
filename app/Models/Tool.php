<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tool extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'credential_id',
        'name',
        'description',
        'target_url',
        'http_method',
        'parameters_schema',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'parameters_schema' => 'array',
        ];
    }

    // ── Relationships ──

    public function credential(): BelongsTo
    {
        return $this->belongsTo(Credential::class);
    }

    public function agents(): BelongsToMany
    {
        return $this->belongsToMany(Agent::class, 'agent_tool')
                    ->withTimestamps();
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    // ── Helpers ──

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
