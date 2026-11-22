<?php

namespace App\Http\Requests\Hrm;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $departmentId = $this->route('department')?->id;
        
        $organizationId = $this->input('organization_id') 
            ?? $this->route('department')?->organization_id
            ?? auth()->user()?->organization_id
            ?? \App\Models\Organization::value('id');

        return [

            
            'name' => ['required', 'string', 'max:255'],
            
            'code' => [
                'required', 
                'string', 
                'max:50', 
                Rule::unique('departments', 'code')->ignore($departmentId)->where('organization_id', $organizationId),
            ],
            
            'description' => ['nullable', 'string', 'max:1000'],
            
            'parent_id' => ['nullable', 'exists:departments,id'],
            

            'head_user_id' => ['nullable', 'exists:users,id'], 
            
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Department name is required.',
            'code.required' => 'Department code is required.',
            'code.unique' => 'This department code already exists.',
            'head_user_id.exists' => 'The selected department head is invalid.',
        ];
    }
}