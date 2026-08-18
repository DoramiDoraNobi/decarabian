<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('agent_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('tool_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->json('request_payload')->nullable();
            $table->text('response_summary')->nullable();
            $table->unsignedInteger('execution_time_ms')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index(['agent_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
