<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
     
        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('payment_account_id')
                  ->nullable()
                  ->after('due_amount')
                  ->constrained('accounts')
                  ->nullOnDelete();
        });

      
        Schema::table('purchases', function (Blueprint $table) {
            $table->foreignId('payment_account_id')
                  ->nullable()
                  ->after('due_amount')
                  ->constrained('accounts')
                  ->nullOnDelete();
        });

 
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('payment_account_id')
                  ->nullable()
                  ->after('account_id')
                  ->constrained('accounts')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payment_account_id');
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payment_account_id');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payment_account_id');
        });
    }
};