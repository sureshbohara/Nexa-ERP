<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Branch;
use App\Models\Expense;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $branch = Branch::where('code', 'HO-001')->first();
        $adminUser = User::where('username', 'companyadmin')->first();
        $rentAccount = Account::where('code', '5300')->first();
        $utilitiesAccount = Account::where('code', '5400')->first();

        if (!$organization || !$branch || !$adminUser || !$rentAccount || !$utilitiesAccount) {
            $this->command->error('Prerequisite data not found.');
            return;
        }

        $expenses = [
            [
                'branch_id' => $branch->id,
                'account_id' => $rentAccount->id,
                'user_id' => $adminUser->id,
                'reference_no' => 'EXP-2026-0001',
                'expense_date' => now()->subDays(10),
                'amount' => 50000.00,
                'tax_amount' => 0,
                'total_amount' => 50000.00,
                'payment_method' => 'bank_transfer',
                'description' => 'Office rent for November 2026',
                'status' => 'approved',
            ],
            [
                'branch_id' => $branch->id,
                'account_id' => $utilitiesAccount->id,
                'user_id' => $adminUser->id,
                'reference_no' => 'EXP-2026-0002',
                'expense_date' => now()->subDays(5),
                'amount' => 8500.00,
                'tax_amount' => 0,
                'total_amount' => 8500.00,
                'payment_method' => 'cash',
                'description' => 'Electricity and water bill',
                'status' => 'approved',
            ],
        ];

        foreach ($expenses as $expense) {
            Expense::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'reference_no' => $expense['reference_no'],
                ],
                array_merge($expense, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Expenses seeded successfully!');
    }
}