<?php

namespace App\Http\Requests\Hrm;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalaryStructureRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        return true;
    }

 
    protected function prepareForValidation(): void
    {
        $organizationId = $this->input('organization_id')
            ?? $this->route('salaryStructure')?->organization_id
            ?? auth()->user()?->organization_id
            ?? Organization::value('id');

        $this->merge([
            'organization_id' => $organizationId,
        ]);
    }


    public function rules(): array
    {
        $salaryStructure = $this->route('salaryStructure');

        $structureId = $salaryStructure?->id;
        $organizationId = $this->input('organization_id');

        return [
            'organization_id' => [
                'nullable',
                Rule::exists('organizations', 'id')
                    ->whereNull('deleted_at'),
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('salary_structures', 'code')
                    ->ignore($structureId)
                    ->where('organization_id', $organizationId),
            ],

            'basic_salary' => [
                'required',
                'numeric',
                'min:0',
            ],

            'house_rent_allowance' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'transport_allowance' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'medical_allowance' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'other_allowance' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'provident_fund' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'tax_deduction' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'other_deduction' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Structure name is required.',

            'code.required' => 'Structure code is required.',

            'code.unique' => 'This structure code already exists.',

            'basic_salary.required' => 'Basic salary is required.',
        ];
    }
}
