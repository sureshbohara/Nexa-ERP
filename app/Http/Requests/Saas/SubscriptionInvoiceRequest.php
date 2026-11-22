<?php

namespace App\Http\Requests\Saas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubscriptionInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $invoiceId = $this->route('subscription_invoice')?->id
            ?? $this->route('subscriptionInvoice')?->id;

        return [
            'organization_id' => [
                'required',
                Rule::exists('organizations', 'id')->whereNull('deleted_at'),
            ],

            'subscription_id' => [
                'required',
                Rule::exists('subscriptions', 'id')
                    ->whereNull('deleted_at')
                    ->where('organization_id', $this->input('organization_id')),
            ],

            'invoice_no' => [
                'required',
                'string',
                'max:100',
                Rule::unique('subscription_invoices', 'invoice_no')->ignore($invoiceId),
            ],

            'invoice_date' => [
                'required',
                'date',
            ],

            'due_date' => [
                'required',
                'date',
                'after_or_equal:invoice_date',
            ],

            'subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],

            'tax_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'discount_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'total_amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'paid_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'status' => [
                'required',
                Rule::in(['unpaid', 'partial', 'paid', 'void']),
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
            'invoice_no.required' => 'Invoice number is required.',
            'invoice_no.unique' => 'This invoice number already exists.',
            'due_date.after_or_equal' => 'Due date must be equal to or after invoice date.',
            'subscription_id.exists' => 'The selected subscription does not belong to this company.',
        ];
    }
}