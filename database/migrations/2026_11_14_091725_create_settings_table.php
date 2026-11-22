<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
           Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->cascadeOnDelete();
            $table->string('group')->default('general');
            $table->string('key');
            $table->json('value')->nullable();
            $table->string('type')->default('string');
            $table->timestamps();

            $table->unique(['organization_id', 'key']);
            $table->index(['organization_id', 'group']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};