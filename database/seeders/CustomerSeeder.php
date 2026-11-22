<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        $customers = [
            [
                'name' => 'Pokhara Trading House',
                'code' => 'CUS-001',
                'contact_person' => 'Binod Maharjan',
                'phone' => '9851000001',
                'email' => 'binod@pokharatrading.com',
                'company_name' => 'Pokhara Trading House',
                'tax_number' => '601999001',
                'province' => 'Gandaki Province',
                'district' => 'Kaski',
                'address' => 'New Road, Pokhara',
                'credit_limit' => 500000,
                'opening_balance' => 0,
                'status' => 'active',
            ],
            [
                'name' => 'Walk-in Customer',
                'code' => 'CUS-WALK',
                'contact_person' => null,
                'phone' => '0000000000',
                'email' => null,
                'company_name' => null,
                'tax_number' => null,
                'province' => null,
                'district' => null,
                'address' => null,
                'credit_limit' => 0,
                'opening_balance' => 0,
                'status' => 'active',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $customer['code'],
                ],
                array_merge($customer, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Customers seeded successfully!');
    }
}