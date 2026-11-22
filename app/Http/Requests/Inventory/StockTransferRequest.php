<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StockTransferRequest extends FormRequest
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

            'source_warehouse_id' => [
                'required',
                'exists:warehouses,id',
            ],

            'destination_warehouse_id' => [
                'required',
                'exists:warehouses,id',
                'different:source_warehouse_id',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
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
            'destination_warehouse_id.different' => 
                'Source and Destination warehouse cannot be the same.',
            'quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}