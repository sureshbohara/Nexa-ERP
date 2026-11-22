<?php

namespace App\Http\Requests\System\Organization;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrganizationRequest extends FormRequest
{
    public function authorize(): bool 
    { 
        return $this->user() !== null; 
    }

    public function rules(): array 
    {
        $organization = $this->route('organization');

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required', 
                'string', 
                'max:50', 
                Rule::unique('organizations', 'code')->ignore($organization?->id)
            ],
            'registration_number' => ['nullable', 'string', 'max:100'],
            'pan_vat_number' => ['nullable', 'string', 'max:100'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'alternate_phone' => ['nullable', 'string', 'max:30'],
            'email' => [
                'nullable', 
                'email', 
                'max:255', 
                Rule::unique('organizations', 'email')->ignore($organization?->id)
            ],
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'province' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'municipality' => ['nullable', 'string', 'max:150'],
            'ward_number' => ['nullable', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:2000'],
            'established_date' => ['nullable', 'date', 'before_or_equal:today'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'This organization code already exists.',
            'email.unique' => 'This email address is already registered.',
            'established_date.before_or_equal' => 'Established date cannot be in the future.',
        ];
    }
}