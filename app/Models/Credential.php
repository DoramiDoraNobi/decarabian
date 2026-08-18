<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class Credential extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'provider',
        'encrypted_secret',
        'auth_type',
        'auth_header_name',
    ];

    protected $hidden = [
        'encrypted_secret',
    ];

    // ── Accessors & Mutators ──

    /**
     * Encrypt the secret before storing.
     */
    public function setSecretAttribute(string $value): void
    {
        $this->attributes['encrypted_secret'] = Crypt::encryptString($value);
    }

    /**
     * Decrypt the secret when retrieving.
     */
    public function getDecryptedSecretAttribute(): string
    {
        return Crypt::decryptString($this->attributes['encrypted_secret']);
    }

    // ── Relationships ──

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tools(): HasMany
    {
        return $this->hasMany(Tool::class);
    }
}
