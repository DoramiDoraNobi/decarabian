<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credentials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('provider')->default('custom');
            $table->text('encrypted_secret');
            $table->enum('auth_type', ['bearer', 'header', 'query'])->default('bearer');
            $table->string('auth_header_name')->nullable();
            $table->timestamps();

            $table->index('provider');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credentials');
    }
};
