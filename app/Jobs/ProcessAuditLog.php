<?php

namespace App\Jobs;

use App\Models\AuditLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessAuditLog implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected array $logData
    ) {}

    /**
     * Execute the job — persist audit log to database.
     */
    public function handle(): void
    {
        AuditLog::create([
            'agent_id'          => $this->logData['agent_id'],
            'tool_id'           => $this->logData['tool_id'] ?? null,
            'action'            => $this->logData['action'],
            'http_status'       => $this->logData['http_status'] ?? null,
            'request_payload'   => $this->logData['request_payload'] ?? null,
            'response_summary'  => $this->logData['response_summary'] ?? null,
            'execution_time_ms' => $this->logData['execution_time_ms'] ?? null,
            'ip_address'        => $this->logData['ip_address'] ?? null,
        ]);
    }
}
