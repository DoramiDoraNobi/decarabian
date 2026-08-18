<?php

namespace App\Guards;

use App\Models\Agent;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AgentTokenGuard implements Guard
{
    protected ?Authenticatable $agent = null;
    protected Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Determine if the current agent is authenticated.
     */
    public function check(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Determine if the current agent is a guest (not authenticated).
     */
    public function guest(): bool
    {
        return !$this->check();
    }

    /**
     * Get the currently authenticated agent.
     */
    public function user(): ?Authenticatable
    {
        if ($this->agent !== null) {
            return $this->agent;
        }

        $token = $this->request->bearerToken();

        if (!$token) {
            return null;
        }

        // Find agent by matching the hashed token
        $agents = Agent::where('is_active', true)->get();

        foreach ($agents as $agent) {
            if (Hash::check($token, $agent->getRawOriginal('agent_token'))) {
                $this->agent = $agent;
                return $this->agent;
            }
        }

        return null;
    }

    /**
     * Get the ID for the currently authenticated agent.
     */
    public function id(): ?string
    {
        return $this->user()?->getAuthIdentifier();
    }

    /**
     * Validate agent credentials.
     */
    public function validate(array $credentials = []): bool
    {
        if (empty($credentials['agent_token'])) {
            return false;
        }

        $agents = Agent::where('is_active', true)->get();

        foreach ($agents as $agent) {
            if (Hash::check($credentials['agent_token'], $agent->getRawOriginal('agent_token'))) {
                $this->agent = $agent;
                return true;
            }
        }

        return false;
    }

    /**
     * Determine if the guard has a user instance.
     */
    public function hasUser(): bool
    {
        return $this->agent !== null;
    }

    /**
     * Set the current agent.
     */
    public function setUser(Authenticatable $user): static
    {
        $this->agent = $user;
        return $this;
    }
}
