<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        // Main Account Categories (Parent Accounts)
        $assets = Account::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => '1000'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Assets',
                'type' => 'asset',
                'sub_type' => null,
                'is_system' => true,
                'status' => 'active',
            ]
        );

        $liabilities = Account::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => '2000'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Liabilities',
                'type' => 'liability',
                'sub_type' => null,
                'is_system' => true,
                'status' => 'active',
            ]
        );

        $equity = Account::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => '3000'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Equity',
                'type' => 'equity',
                'sub_type' => null,
                'is_system' => true,
                'status' => 'active',
            ]
        );

        $income = Account::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => '4000'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Income',
                'type' => 'income',
                'sub_type' => null,
                'is_system' => true,
                'status' => 'active',
            ]
        );

        $expenses = Account::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => '5000'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Expenses',
                'type' => 'expense',
                'sub_type' => null,
                'is_system' => true,
                'status' => 'active',
            ]
        );

        // Asset Sub-Accounts
        $assetAccounts = [
            ['code' => '1100', 'name' => 'Cash in Hand', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1200', 'name' => 'Bank Accounts', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1300', 'name' => 'Accounts Receivable', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1400', 'name' => 'Inventory', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1500', 'name' => 'Fixed Assets', 'type' => 'asset', 'sub_type' => 'fixed_asset'],
        ];

        foreach ($assetAccounts as $account) {
            Account::updateOrCreate(
                ['organization_id' => $organization->id, 'code' => $account['code']],
                array_merge($account, [
                    'organization_id' => $organization->id,
                    'parent_id' => $assets->id,
                    'is_system' => true,
                    'status' => 'active',
                ])
            );
        }

        // Liability Sub-Accounts
        $liabilityAccounts = [
            ['code' => '2100', 'name' => 'Accounts Payable', 'type' => 'liability', 'sub_type' => 'current_liability'],
            ['code' => '2200', 'name' => 'Tax Payable', 'type' => 'liability', 'sub_type' => 'current_liability'],
            ['code' => '2300', 'name' => 'Short-term Loans', 'type' => 'liability', 'sub_type' => 'current_liability'],
            ['code' => '2400', 'name' => 'Long-term Loans', 'type' => 'liability', 'sub_type' => 'long_term_liability'],
        ];

        foreach ($liabilityAccounts as $account) {
            Account::updateOrCreate(
                ['organization_id' => $organization->id, 'code' => $account['code']],
                array_merge($account, [
                    'organization_id' => $organization->id,
                    'parent_id' => $liabilities->id,
                    'is_system' => true,
                    'status' => 'active',
                ])
            );
        }

        // Equity Sub-Accounts
        $equityAccounts = [
            ['code' => '3100', 'name' => 'Owner Capital', 'type' => 'equity', 'sub_type' => 'capital'],
            ['code' => '3200', 'name' => 'Retained Earnings', 'type' => 'equity', 'sub_type' => 'earnings'],
        ];

        foreach ($equityAccounts as $account) {
            Account::updateOrCreate(
                ['organization_id' => $organization->id, 'code' => $account['code']],
                array_merge($account, [
                    'organization_id' => $organization->id,
                    'parent_id' => $equity->id,
                    'is_system' => true,
                    'status' => 'active',
                ])
            );
        }

        // Income Sub-Accounts
        $incomeAccounts = [
            ['code' => '4100', 'name' => 'Sales Revenue', 'type' => 'income', 'sub_type' => 'operating_income'],
            ['code' => '4200', 'name' => 'Service Revenue', 'type' => 'income', 'sub_type' => 'operating_income'],
            ['code' => '4300', 'name' => 'Other Income', 'type' => 'income', 'sub_type' => 'non_operating_income'],
        ];

        foreach ($incomeAccounts as $account) {
            Account::updateOrCreate(
                ['organization_id' => $organization->id, 'code' => $account['code']],
                array_merge($account, [
                    'organization_id' => $organization->id,
                    'parent_id' => $income->id,
                    'is_system' => true,
                    'status' => 'active',
                ])
            );
        }

        // Expense Sub-Accounts
        $expenseAccounts = [
            ['code' => '5100', 'name' => 'Cost of Goods Sold', 'type' => 'expense', 'sub_type' => 'direct_expense'],
            ['code' => '5200', 'name' => 'Salaries Expense', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '5300', 'name' => 'Rent Expense', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '5400', 'name' => 'Utilities Expense', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '5500', 'name' => 'Office Supplies', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '5600', 'name' => 'Marketing Expense', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '5700', 'name' => 'Miscellaneous Expense', 'type' => 'expense', 'sub_type' => 'operating_expense'],
        ];

        foreach ($expenseAccounts as $account) {
            Account::updateOrCreate(
                ['organization_id' => $organization->id, 'code' => $account['code']],
                array_merge($account, [
                    'organization_id' => $organization->id,
                    'parent_id' => $expenses->id,
                    'is_system' => true,
                    'status' => 'active',
                ])
            );
        }

        $this->command->info('Chart of Accounts seeded successfully!');
    }
}