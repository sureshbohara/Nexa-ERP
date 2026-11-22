<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool 
    { 
        return $this->user() !== null; 
    }

    public function rules(): array 
    {
        $userId = $this->user()->id;

        return [
            'first_name'    => ['required', 'string', 'max:100'],
            'last_name'     => ['required', 'string', 'max:100'],
            'email'         => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'username'      => ['required', 'string', 'max:50', Rule::unique('users', 'username')->ignore($userId)],
            'phone'         => ['nullable', 'string', 'max:30'],
            'gender'        => ['nullable', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'designation'   => ['nullable', 'string', 'max:100'],
            'address'       => ['nullable', 'string', 'max:500'],
            'bio'           => ['nullable', 'string', 'max:1000'],
            'image'         => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'The first name field is required.',
            'last_name.required' => 'The last name field is required.',
            'email.required' => 'The email field is required.',
            'username.required' => 'The username field is required.',
            'date_of_birth.before' => 'Date of birth must be a past date.',
            'image.mimes' => 'The profile image must be a file of type: jpg, jpeg, png, webp.',
            'image.max' => 'The profile image may not be greater than 2MB.',
        ];
    }
}