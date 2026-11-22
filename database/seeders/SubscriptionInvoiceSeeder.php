<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPayment;
use App\Models\PaymentGateway;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionInvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        $subscription = Subscription::withoutGlobalScopes()
            ->where('organization_id', $organization?->id)
            ->latest('id')
            ->first();

        $gateway = PaymentGateway::where('code', 'bank')->first();
        $adminUser = User::withoutGlobalScopes()->where('username', 'companyadmin')->first();

        if (!$organization || !$subscription) {
            $this->command->error('Organization or Subscription not found.');
            return;
        }

        $plan = $subscription->plan;
        $subtotal = (float) ($plan?->price ?? 0);
        $taxAmount = round($subtotal * 0.13, 2);
        $totalAmount = $subtotal + $taxAmount;

        DB::transaction(function () use ($organization, $subscription, $gateway, $adminUser, $subtotal, $taxAmount, $totalAmount) {
            $invoice = SubscriptionInvoice::withoutGlobalScopes()->updateOrCreate(
                ['invoice_no' => 'SUB-INV-2026-0001'],
                [
                    'organization_id' => $organization->id,
                    'subscription_id' => $subscription->id,
                    'invoice_date' => now()->startOfMonth()->toDateString(),
                    'due_date' => now()->startOfMonth()->addDays(7)->toDateString(),
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'discount_amount' => 0,
                    'total_amount' => $totalAmount,
                    'paid_amount' => $totalAmount,
                    'status' => 'paid',
                    'notes' => 'Yearly subscription payment',
                ]
            );

            SubscriptionPayment::withoutGlobalScopes()->updateOrCreate(
                [
                    'subscription_id' => $subscription->id,
                    'transaction_id' => 'TXN-BANK-0001',
                ],
                [
                    'organization_id' => $organization->id,
                    'subscription_id' => $subscription->id,
                    'subscription_invoice_id' => $invoice->id,
                    'payment_gateway_id' => $gateway?->id,
                    'user_id' => $adminUser?->id,
                    'amount' => $totalAmount,
                    'currency' => 'NPR',
                    'payment_method' => 'bank_transfer',
                    'transaction_id' => 'TXN-BANK-0001',
                    'payment_date' => now()->startOfMonth()->toDateString(),
                    'status' => 'paid',
                    'notes' => 'Paid via bank transfer',
                ]
            );
        });

        $this->command->info('Subscription invoice and payment seeded successfully!');
    }
}