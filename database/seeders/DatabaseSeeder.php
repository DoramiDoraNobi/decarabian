<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Agent;
use App\Models\Credential;
use App\Models\Tool;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with complete Decarabian demo data.
     */
    public function run(): void
    {
        // 1. Create Admin User
        $user = User::updateOrCreate(
            ['email' => 'admin@decarabian.com'],
            [
                'name' => 'Decarabian Admin',
                'password' => Hash::make('password123'),
            ]
        );

        // Also ensure admin@test.com exists
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin Test',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Create Stored Credential in Vault (AES Encrypted automatically)
        $stripeCredential = Credential::updateOrCreate(
            ['name' => 'Stripe Production Vault'],
            [
                'user_id' => $user->id,
                'provider' => 'stripe',
                'encrypted_secret' => \Illuminate\Support\Facades\Crypt::encryptString('sk_live_decarabian_super_secret_key_888'),
                'auth_type' => 'bearer',
                'auth_header_name' => 'Authorization',
            ]
        );

        $githubCredential = Credential::updateOrCreate(
            ['name' => 'GitHub Org Token'],
            [
                'user_id' => $user->id,
                'provider' => 'github',
                'encrypted_secret' => \Illuminate\Support\Facades\Crypt::encryptString('ghp_secret_access_token_999xyz'),
                'auth_type' => 'bearer',
                'auth_header_name' => 'Authorization',
            ]
        );

        // 3. Register Tools (Targeting echo endpoint httpbin.org for safe testing)
        $invoiceTool = Tool::updateOrCreate(
            ['name' => 'stripe.create_invoice'],
            [
                'credential_id' => $stripeCredential->id,
                'description' => 'Create a customer invoice safely in Stripe',
                'target_url' => 'https://httpbin.org/anything',
                'http_method' => 'POST',
                'parameters_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'customer' => ['type' => 'string', 'description' => 'Customer ID'],
                        'amount' => ['type' => 'number', 'description' => 'Amount in USD'],
                    ],
                    'required' => ['customer', 'amount']
                ],
                'is_active' => true,
            ]
        );

        $githubTool = Tool::updateOrCreate(
            ['name' => 'github.create_issue'],
            [
                'credential_id' => $githubCredential->id,
                'description' => 'Create a GitHub issue for bugs or feature requests',
                'target_url' => 'https://httpbin.org/anything',
                'http_method' => 'POST',
                'parameters_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => ['type' => 'string', 'description' => 'Issue title'],
                        'body' => ['type' => 'string', 'description' => 'Issue description'],
                    ],
                    'required' => ['title']
                ],
                'is_active' => true,
            ]
        );

        $refundTool = Tool::updateOrCreate(
            ['name' => 'stripe.danger_refund'],
            [
                'credential_id' => $stripeCredential->id,
                'description' => 'DANGEROUS: Refund customer transaction',
                'target_url' => 'https://httpbin.org/anything',
                'http_method' => 'POST',
                'parameters_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'charge_id' => ['type' => 'string']
                    ]
                ],
                'is_active' => true,
            ]
        );

        // 4. Create AI Agent (SupportBot) with known fixed token for demo
        $agent = Agent::updateOrCreate(
            ['name' => 'SupportBot'],
            [
                'user_id' => $user->id,
                'description' => 'Autonomous customer support agent for invoicing and ticket tracking',
                'agent_token' => Hash::make('ag_decarabian_demo_token_12345'),
                'rate_limit' => 100,
                'is_active' => true,
            ]
        );

        // 5. Grant Permissions: SupportBot can ONLY do invoicing & github, NOT refund
        $agent->tools()->sync([$invoiceTool->id, $githubTool->id]);
    }
}
