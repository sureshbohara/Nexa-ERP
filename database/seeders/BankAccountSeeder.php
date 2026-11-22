<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\BankAccount;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class BankAccountSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $bankAccountHead = Account::where('code', '1200')->first();

        if (!$organization || !$bankAccountHead) {
            $this->command->error('Organization or Bank Account head not found.');
            return;
        }

        $bankAccounts = [
            [
                'account_id' => $bankAccountHead->id,
                'name' => 'Nepal Bank - Main Current Account',
                'bank_name' => 'Nepal Bank Limited',
                'account_number' => '01234567890123',
                'account_type' => 'current',
                'branch_name' => 'Putalisadak Branch',
                'ifsc_code' => 'NBLNPKATXXX',
                'opening_balance' => 500000.00,
                'current_balance' => 500000.00,
                'status' => 'active',
            ],
            [
                'account_id' => $bankAccountHead->id,
                'name' => 'Global IME - Savings Account',
                'bank_name' => 'Global IME Bank',
                'account_number' => '09876543210987',
                'account_type' => 'savings',
                'branch_name' => 'Kathmandu Branch',
                'ifsc_code' => 'GLBBNPKTXXX',
                'opening_balance' => 1000000.00,
                'current_balance' => 1000000.00,
                'status' => 'active',
            ],
        ];

        foreach ($bankAccounts as $bankAccount) {
            BankAccount::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'account_number' => $bankAccount['account_number'],
                ],
                array_merge($bankAccount, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Bank Accounts seeded successfully!');
    }
}