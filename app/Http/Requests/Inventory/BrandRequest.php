<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $brand = $this->route('brand');

        $id = $brand instanceof \App\Models\Brand
            ? $brand->id
            : $brand;

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('brands', 'name')->ignore($id),
            ],

            'code' => [
                'nullable',
                'string',
                'max:50',
            ],

            'description' => [
                'nullable',
                'string',
                'max:500',
            ],

            'logo' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,svg',
                'max:2048',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ];
    }
}
