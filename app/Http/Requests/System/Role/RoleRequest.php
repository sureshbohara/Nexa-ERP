<?php

namespace App\Http\Requests\System\Role;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $role = $this->route('role');

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'name')->ignore($role?->id),
            ],
            'guard_name' => [
                'required',
                'string',
                'max:50',
                'in:web,api', 
            ],
            'permissions' => [
                'nullable',
                'array',
            ],
            'permissions.*' => [
                'integer',
                'exists:permissions,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'This role name already exists.',
            'permissions.*.exists' => 'One or more selected permissions are invalid.',
        ];
    }
}