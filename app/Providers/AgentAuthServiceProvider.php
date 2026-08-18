<?php

namespace App\Providers;

use App\Guards\AgentTokenGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AgentAuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Register the custom 'agent-token' driver
        Auth::extend('agent-token', function ($app, $name, array $config) {
            return new AgentTokenGuard($app['request']);
        });
    }
}
