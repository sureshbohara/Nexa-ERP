<?php

namespace App\Http\Requests\Accounting;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $accountId = $this->route('account')?->id;
        
        $organizationId = $this->input('organization_id') 
            ?? $this->route('account')?->organization_id
            ?? auth()->user()?->organization_id
            ?? Organization::value('id');

        return [
            'organization_id' => [
                'nullable',
                Rule::exists('organizations', 'id')
                    ->whereNull('deleted_at')
                    ->where('status', 'active'),
            ],

            'parent_id' => [
                'nullable',
                Rule::exists('accounts', 'id')
                    ->whereNull('deleted_at')
                    ->where('id', '!=', $accountId),
            ],

            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('accounts', 'code')
                    ->ignore($accountId)
                    ->where('organization_id', $organizationId),
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                Rule::in(['asset', 'liability', 'equity', 'income', 'expense']),
            ],

            'sub_type' => [
                'nullable',
                'string',
                'max:100',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Account code is required.',
            'code.unique' => 'This account code already exists in your organization.',
            'name.required' => 'Account name is required.',
            'type.required' => 'Account type is required.',
            'type.in' => 'Account type must be asset, liability, equity, income, or expense.',
        ];
    }
}