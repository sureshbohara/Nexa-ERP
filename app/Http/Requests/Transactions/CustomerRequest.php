<?php

namespace App\Http\Requests\Transactions;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;
        

        $organizationId = $this->input('organization_id') 
            ?? $this->route('customer')?->organization_id 
            ?? auth()->user()?->organization_id 
            ?? Organization::value('id');

        return [
            'organization_id' => [
                'nullable',
                Rule::exists('organizations', 'id')
                    ->whereNull('deleted_at')
                    ->where('status', 'active'),
            ],

            'name' => ['required', 'string', 'max:255'],

            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('customers', 'code')
                    ->ignore($customerId)
                    ->where('organization_id', $organizationId),
            ],

            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'alternate_phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'tax_number' => ['nullable', 'string', 'max:100'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'municipality' => ['nullable', 'string', 'max:150'],
            'address' => ['nullable', 'string', 'max:2000'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'opening_balance' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Customer name is required.',
            'code.required' => 'Customer code is required.',
            'code.unique' => 'This customer code already exists in your organization.',
            'phone.required' => 'Phone number is required.',
        ];
    }
}