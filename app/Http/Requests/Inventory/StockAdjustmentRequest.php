<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StockAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'exists:products,id',
            ],

            'warehouse_id' => [
                'required',
                'exists:warehouses,id',
            ],

            'type' => [
                'required',
                'in:stock_in,stock_out,adjustment',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'batch_number' => [
                'nullable',
                'string',
                'max:100',
            ],

            'expiry_date' => [
                'nullable',
                'date',
                'after:today',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'The selected product is invalid.',
            'warehouse_id.exists' => 'The selected warehouse is invalid.',
            'quantity.min' => 'Quantity must be at least 0.',
            'expiry_date.after' => 'The expiry date must be a future date.',
        ];
    }
}