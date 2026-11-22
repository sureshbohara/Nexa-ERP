<?php

namespace App\Http\Requests\Accounting;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    protected function prepareForValidation(): void
    {
        $organizationId = $this->input('organization_id') 
            ?? $this->route('bankAccount')?->organization_id
            ?? auth()->user()?->organization_id
            ?? Organization::value('id');

        $this->merge([
            'organization_id' => $organizationId,
        ]);
    }

    public function rules(): array
    {
        $bankAccountId = $this->route('bankAccount')?->id;
        $organizationId = $this->input('organization_id'); 

        return [
            'organization_id' => [
                'nullable',
                Rule::exists('organizations', 'id')
                    ->whereNull('deleted_at')
                    ->where('status', 'active'),
            ],

            'account_id' => [
                'nullable',
                Rule::exists('accounts', 'id')
                    ->whereNull('deleted_at')
                    ->where('organization_id', $organizationId),
            ],

            'name' => ['required', 'string', 'max:255'],
            'bank_name' => ['required', 'string', 'max:255'],
            
            'account_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('bank_accounts', 'account_number')
                    ->ignore($bankAccountId)
                    ->where('organization_id', $organizationId),
            ],

            'account_type' => ['required', Rule::in(['current', 'savings', 'fixed', 'loan'])],
            'branch_name' => ['nullable', 'string', 'max:255'],
            'ifsc_code' => ['nullable', 'string', 'max:50'],
            'opening_balance' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Account name is required.',
            'bank_name.required' => 'Bank name is required.',
            'account_number.required' => 'Account number is required.',
            'account_number.unique' => 'This account number already exists in your organization.',
            'account_type.required' => 'Account type is required.',
        ];
    }
}