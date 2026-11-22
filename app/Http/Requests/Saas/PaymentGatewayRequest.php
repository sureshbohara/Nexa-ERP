<?php

namespace App\Http\Requests\Saas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentGatewayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $gatewayId = $this->route('payment_gateway')?->id
            ?? $this->route('paymentGateway')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('payment_gateways', 'code')->ignore($gatewayId),
            ],

            'logo' => $gatewayId
                ? 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
                : 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'credentials' => [
                'nullable',
                'array',
            ],

            'is_test_mode' => [
                'nullable',
                'boolean',
            ],

            'is_active' => [
                'nullable',
                'boolean',
            ],

            'sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Gateway name is required.',
            'code.required' => 'Gateway code is required.',
            'code.unique' => 'This gateway code already exists.',
            'logo.max' => 'Logo size must not exceed 2MB.',
        ];
    }
}