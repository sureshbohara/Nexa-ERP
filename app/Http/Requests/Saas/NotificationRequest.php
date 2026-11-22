<?php

namespace App\Http\Requests\Saas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'organization_id' => [
                'nullable',
                Rule::exists('organizations', 'id')->whereNull('deleted_at'),
            ],

            'type' => [
                'required',
                'string',
                'max:100',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'message' => [
                'required',
                'string',
                'max:2000',
            ],

            'priority' => [
                'required',
                Rule::in(['low', 'normal', 'high']),
            ],

            'data' => [
                'nullable',
                'array',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Notification title is required.',
            'message.required' => 'Notification message is required.',
            'priority.required' => 'Please select a priority.',
        ];
    }
}