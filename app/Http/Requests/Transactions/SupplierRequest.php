<?php

namespace App\Http\Requests\Transactions;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplierId = $this->route('supplier')?->id;
        

        $organizationId = $this->input('organization_id') 
            ?? $this->route('supplier')?->organization_id 
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
                Rule::unique('suppliers', 'code')
                    ->ignore($supplierId)
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
            'opening_balance' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Supplier name is required.',
            'code.required' => 'Supplier code is required.',
            'code.unique' => 'This supplier code already exists in your organization.',
            'phone.required' => 'Phone number is required.',
        ];
    }
}