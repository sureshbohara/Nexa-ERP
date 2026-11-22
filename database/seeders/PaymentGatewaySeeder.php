<?php

namespace Database\Seeders;

use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class PaymentGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateways = [
            [
                'name' => 'Cash / Manual',
                'code' => 'manual',
                'is_test_mode' => false,
                'is_active' => true,
                'sort_order' => 1,
                'credentials' => [],
            ],
            [
                'name' => 'Bank Transfer',
                'code' => 'bank',
                'is_test_mode' => false,
                'is_active' => true,
                'sort_order' => 2,
                'credentials' => [
                    'bank_name' => 'Nepal Bank Limited',
                    'account_number' => '01234567890123',
                ],
            ],
            [
                'name' => 'eSewa',
                'code' => 'esewa',
                'is_test_mode' => true,
                'is_active' => true,
                'sort_order' => 3,
                'credentials' => [
                    'merchant_id' => 'EPAYTEST',
                    'secret_key' => 'test-secret',
                ],
            ],
            [
                'name' => 'Khalti',
                'code' => 'khalti',
                'is_test_mode' => true,
                'is_active' => true,
                'sort_order' => 4,
                'credentials' => [
                    'public_key' => 'test-public-key',
                    'secret_key' => 'test-secret-key',
                ],
            ],
            [
                'name' => 'Stripe',
                'code' => 'stripe',
                'is_test_mode' => true,
                'is_active' => false,
                'sort_order' => 5,
                'credentials' => [
                    'publishable_key' => 'pk_test_xxx',
                    'secret_key' => 'sk_test_xxx',
                ],
            ],
        ];

        foreach ($gateways as $gateway) {
            PaymentGateway::updateOrCreate(
                ['code' => $gateway['code']],
                $gateway
            );
        }

        $this->command->info('Payment gateways seeded successfully!');
    }
}