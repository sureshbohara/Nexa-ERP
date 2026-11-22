<?php

namespace App\Http\Requests\System\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Database\Query\Builder;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'username' => ['required', 'string', 'max:50', Rule::unique('users', 'username')->ignore($user?->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Password::min(8)->letters()->numbers()],
            'role_id' => ['nullable', 'exists:roles,id'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'branch_id' => [
                'nullable',
                Rule::exists('branches', 'id')->where(fn (Builder $query) =>
                    $query->where('organization_id', $this->input('organization_id'))
                ),
            ],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'designation'   => ['nullable', 'string', 'max:100'],
            'address'       => ['nullable', 'string', 'max:500'],
        ];
    }
}