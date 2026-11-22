<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class ProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'name' => 'required|string|max:100', 
            'value' => 'required|string|max:100', 
            'sku' => 'nullable|string|max:100',
            'additional_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Variant name is required (e.g., Color, Size).',
            'value.required' => 'Variant value is required (e.g., Red, Large).',
            'product_id.exists' => 'Invalid product selected.',
        ];
    }
}