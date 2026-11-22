<?php

namespace App\Http\Requests\Transactions;

use App\Models\Organization;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class PurchaseReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $user = $this->user();
        $return = $this->route('purchase_return');

        $organizationId = $this->input('organization_id')
            ?? $user?->organization_id
            ?? ($return instanceof PurchaseReturn ? $return->organization_id : null)
            ?? Organization::value('id');

   
        $branchId = $this->input('branch_id')
            ?? $user?->branch_id
            ?? ($return instanceof PurchaseReturn ? $return->branch_id : null);


        $items = collect($this->input('items', []))
            ->map(function ($item) {
                $quantity = (float) ($item['quantity'] ?? 0);
                $price = (float) ($item['unit_price'] ?? 0);
                $total = $quantity * $price;

                return array_merge($item, [
                    'quantity' => (int) $quantity,
                    'unit_price' => round($price, 2),
                    'total' => round($total, 2),
                ]);
            })
            ->values()
            ->all();


        $subtotal = collect($items)->sum('total');
        $taxAmount = (float) $this->input('tax_amount', 0);
        $discountAmount = (float) $this->input('discount_amount', 0);
        $totalAmount = max(0, $subtotal + $taxAmount - $discountAmount);


        $referenceNo = $this->input('reference_no');
        if (empty($referenceNo) && !$return) {
            $lastReturn = PurchaseReturn::latest('id')->first();
            $nextNumber = $lastReturn
                ? (intval(substr($lastReturn->reference_no, 4)) + 1)
                : 1;
            $referenceNo = 'RET-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        }


        $this->merge([
            'organization_id' => $organizationId,
            'branch_id' => $branchId,
            'reference_no' => $referenceNo,
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'tax_amount' => round($taxAmount, 2),
            'discount_amount' => round($discountAmount, 2),
            'total_amount' => round($totalAmount, 2),
        ]);
    }

    public function rules(): array
    {
        $return = $this->route('purchase_return');
        $returnId = $return instanceof PurchaseReturn ? $return->id : null;
        $organizationId = $this->input('organization_id');

        return [
    
            'organization_id' => [
                'nullable',
                Rule::exists('organizations', 'id')
                    ->whereNull('deleted_at')
                    ->where('status', 'active'),
            ],

            'branch_id' => [
                'nullable',
                Rule::exists('branches', 'id')->whereNull('deleted_at'),
            ],


            'supplier_id' => [
                'required',
                Rule::exists('suppliers', 'id')
                    ->whereNull('deleted_at')
                    ->where('status', 'active'),
            ],

            'purchase_id' => [
                'nullable',
                Rule::exists('purchases', 'id')->whereNull('deleted_at'),
            ],

            'warehouse_id' => [
                'nullable',
                Rule::exists('warehouses', 'id')->whereNull('deleted_at'),
            ],

            'reference_no' => [
                'required',
                'string',
                'max:100',
                Rule::unique('purchase_returns', 'reference_no')
                    ->where('organization_id', $organizationId)
                    ->ignore($returnId),
            ],

            'return_date' => ['required', 'date'],

            'subtotal' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],

            'status' => ['required', Rule::in(['pending', 'completed', 'cancelled'])],

            'notes' => ['nullable', 'string', 'max:2000'],

          
            'items' => ['required', 'array', 'min:1'],

            'items.*.product_id' => [
                'required',
                Rule::exists('products', 'id')
                    ->whereNull('deleted_at')
                    ->where('status', 'active'),
            ],

            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.total' => ['required', 'numeric', 'min:0'],
            'items.*.batch_number' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
     
            if ($this->input('purchase_id')) {
                $purchase = Purchase::find($this->input('purchase_id'));

                if ($purchase) {
               
                    if (strtotime($this->input('return_date')) < strtotime($purchase->purchase_date)) {
                        $validator->errors()->add(
                            'return_date',
                            'Return date cannot be before the purchase date (' . $purchase->purchase_date . ').'
                        );
                    }

            
                    $purchaseItems = $purchase->items()->get()->keyBy('product_id');

                    foreach ($this->input('items', []) as $index => $item) {
                        $productId = $item['product_id'] ?? null;
                        $returnQty = (int) ($item['quantity'] ?? 0);

                        if ($productId && $purchaseItems->has($productId)) {
                            $purchasedQty = $purchaseItems[$productId]->quantity;

              
                            $alreadyReturned = \App\Models\PurchaseReturnItem::whereHas('purchaseReturn', function ($query) use ($purchase, $index) {
                                $query->where('purchase_id', $purchase->id)
                                      ->where('status', '!=', 'cancelled');

                     
                                $currentReturnId = $this->route('purchase_return')?->id;
                                if ($currentReturnId) {
                                    $query->where('purchase_returns.id', '!=', $currentReturnId);
                                }
                            })->where('product_id', $productId)->sum('quantity');

                            $availableQty = $purchasedQty - $alreadyReturned;

                            if ($returnQty > $availableQty) {
                                $validator->errors()->add(
                                    "items.{$index}.quantity",
                                    "Only {$availableQty} units available to return for this product (purchased: {$purchasedQty}, already returned: {$alreadyReturned})."
                                );
                            }
                        }
                    }
                }
            }
        });
    }

 
    public function messages(): array
    {
        return [
            'supplier_id.required' => 'Please select a supplier.',
            'supplier_id.exists' => 'Selected supplier does not exist or is inactive.',

            'purchase_id.exists' => 'Selected purchase does not exist.',

            'warehouse_id.exists' => 'Selected warehouse does not exist.',

            'reference_no.required' => 'Reference number is required.',
            'reference_no.unique' => 'This return reference number already exists.',

            'return_date.required' => 'Return date is required.',

            'items.required' => 'At least one return item is required.',
            'items.min' => 'At least one return item is required.',

            'items.*.product_id.required' => 'Please select a product.',
            'items.*.product_id.exists' => 'Selected product does not exist or is inactive.',

            'items.*.quantity.required' => 'Return quantity is required.',
            'items.*.quantity.min' => 'Return quantity must be at least 1.',

            'items.*.unit_price.required' => 'Unit price is required.',
            'items.*.unit_price.min' => 'Unit price cannot be negative.',

            'status.required' => 'Please select a return status.',
            'status.in' => 'Invalid return status selected.',
        ];
    }

  
    public function attributes(): array
    {
        return [
            'supplier_id' => 'supplier',
            'purchase_id' => 'original purchase',
            'warehouse_id' => 'warehouse',
            'reference_no' => 'reference number',
            'return_date' => 'return date',
            'tax_amount' => 'tax amount',
            'discount_amount' => 'discount',
            'total_amount' => 'total amount',
            'items' => 'return items',
        ];
    }
}