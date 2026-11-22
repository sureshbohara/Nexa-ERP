<?php

namespace App\Http\Requests\Saas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubscriptionPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = $this->input('organization_id')
            ?? $this->user()?->organization_id;

        return [
            'organization_id' => [
                'required',
                Rule::exists('organizations', 'id')->whereNull('deleted_at'),
            ],

            'subscription_id' => [
                'required',
                Rule::exists('subscriptions', 'id')
                    ->whereNull('deleted_at')
                    ->where('organization_id', $organizationId),
            ],

            'subscription_invoice_id' => [
                'nullable',
                Rule::exists('subscription_invoices', 'id')
                    ->whereNull('deleted_at')
                    ->where('organization_id', $organizationId),
            ],

            'payment_gateway_id' => [
                'nullable',
                Rule::exists('payment_gateways', 'id')
                    ->whereNull('deleted_at')
                    ->where('is_active', true),
            ],

            'amount' => [
                'required',
                'numeric',
                'min:1',
            ],

            'currency' => [
                'nullable',
                'string',
                'max:10',
            ],

            'payment_method' => [
                'required',
                Rule::in(['cash', 'bank_transfer', 'cheque', 'esewa', 'khalti', 'stripe', 'other']),
            ],

            'transaction_id' => [
                'nullable',
                'string',
                'max:150',
            ],

            'payment_date' => [
                'required',
                'date',
            ],

            'status' => [
                'required',
                Rule::in(['pending', 'paid', 'failed', 'refunded']),
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Payment amount is required.',
            'amount.min' => 'Payment amount must be at least 1.',
            'payment_method.required' => 'Please select a payment method.',
            'payment_date.required' => 'Payment date is required.',
        ];
    }
}