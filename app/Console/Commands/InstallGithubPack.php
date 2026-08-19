<?php

namespace App\Console\Commands;

use App\Models\Credential;
use App\Models\Tool;
use App\Models\User;
use Illuminate\Console\Command;

class InstallGithubPack extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'decarabian:install-github {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Installs the universal GitHub Toolpack for an Admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Installing GitHub Universal Toolpack...');

        // Find user
        $email = $this->argument('email');
        if ($email) {
            $user = User::where('email', $email)->first();
        } else {
            $user = User::first(); // Grab the first admin
        }

        if (!$user) {
            $this->error('No user found! Please run the seeder or specify an email.');
            return;
        }

        $this->info("Found user: {$user->email} (ID: {$user->id}). Installing pack for this user...");

        // 1. Create a placeholder credential if it doesn't exist
        $credential = Credential::where('name', 'GitHub Universal PAT')->where('user_id', $user->id)->first();
        
        if (!$credential) {
            $credential = new Credential();
            $credential->name = 'GitHub Universal PAT';
            $credential->user_id = $user->id;
            $credential->auth_type = 'bearer';
            $credential->secret = 'ghp_REPLACE_ME_IN_DASHBOARD'; // Mutator will encrypt this
            $credential->save();
        }

        $this->info('Credential "GitHub Universal PAT" generated (Please replace the dummy key in the UI later).');

        // 2. Define the Universal GitHub Tools
        $tools = [
            [
                'name' => 'github.issue.list',
                'description' => 'List issues in a repository. Requires {owner} and {repo}.',
                'target_url' => 'https://api.github.com/repos/{owner}/{repo}/issues',
                'http_method' => 'GET',
            ],
            [
                'name' => 'github.issue.create',
                'description' => 'Create a new issue. Requires {owner}, {repo}, {title}, and {body}.',
                'target_url' => 'https://api.github.com/repos/{owner}/{repo}/issues',
                'http_method' => 'POST',
            ],
            [
                'name' => 'github.pull_request.list',
                'description' => 'List pull requests. Requires {owner} and {repo}.',
                'target_url' => 'https://api.github.com/repos/{owner}/{repo}/pulls',
                'http_method' => 'GET',
            ],
            [
                'name' => 'github.pull_request.create',
                'description' => 'Create a pull request. Requires {owner}, {repo}, {title}, {head}, and {base}.',
                'target_url' => 'https://api.github.com/repos/{owner}/{repo}/pulls',
                'http_method' => 'POST',
            ],
            [
                'name' => 'github.repo.get',
                'description' => 'Get repository details. Requires {owner} and {repo}.',
                'target_url' => 'https://api.github.com/repos/{owner}/{repo}',
                'http_method' => 'GET',
            ],
            [
                'name' => 'github.file.read',
                'description' => 'Read a file from repo. Requires {owner}, {repo}, and {path}.',
                'target_url' => 'https://api.github.com/repos/{owner}/{repo}/contents/{path}',
                'http_method' => 'GET',
            ],
            [
                'name' => 'github.search.code',
                'description' => 'Search code globally. Requires {q}.',
                'target_url' => 'https://api.github.com/search/code',
                'http_method' => 'GET',
            ]
        ];

        // 3. Register tools
        foreach ($tools as $toolData) {
            Tool::updateOrCreate(
                ['name' => $toolData['name']],
                [
                    'credential_id' => $credential->id,
                    'description' => $toolData['description'],
                    'target_url' => $toolData['target_url'],
                    'http_method' => $toolData['http_method'],
                ]
            );
        }

        $this->info(count($tools) . ' GitHub Tools successfully registered!');
        $this->info('You can now see and modify them in the Decarabian Web Dashboard.');
    }
}
