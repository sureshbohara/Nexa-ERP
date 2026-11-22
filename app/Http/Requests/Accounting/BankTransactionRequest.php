<?php

namespace App\Http\Requests\Accounting;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BankTransactionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        $organizationId = $this->input('organization_id') 
            ?? $this->route('bankTransaction')?->organization_id
            ?? auth()->user()?->organization_id
            ?? Organization::value('id');

        $this->merge(['organization_id' => $organizationId]);
    }

    public function rules(): array
    {
        $organizationId = $this->input('organization_id');

        return [
            'organization_id' => [
                'nullable',
                Rule::exists('organizations', 'id')->whereNull('deleted_at')->where('status', 'active'),
            ],
            'bank_account_id' => [
                'required',
                Rule::exists('bank_accounts', 'id')
                    ->whereNull('deleted_at')
                    ->where('organization_id', $organizationId)
                    ->where('status', 'active'),
            ],
            'transaction_date' => ['required', 'date'],
            'type' => ['required', Rule::in(['deposit', 'withdrawal'])],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'reference_no' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'bank_account_id.required' => 'Please select a bank account.',
            'bank_account_id.exists' => 'Selected bank account is invalid or inactive.',
            'transaction_date.required' => 'Transaction date is required.',
            'type.required' => 'Please select transaction type (Deposit or Withdrawal).',
            'amount.required' => 'Amount is required.',
            'amount.min' => 'Amount must be greater than 0.',
        ];
    }
}