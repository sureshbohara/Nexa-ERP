<?php

namespace App\Http\Requests\Transactions;

use App\Models\Organization;
use App\Models\Purchase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PurchaseRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        $user = $this->user();
        $purchase = $this->route('purchase');

        $organizationId = $this->input('organization_id')
            ?? $user?->organization_id
            ?? ($purchase instanceof Purchase ? $purchase->organization_id : null)
            ?? Organization::value('id');

        $items = collect($this->input('items', []))
            ->map(function ($item) {
                $quantity = (float) ($item['quantity'] ?? 0);
                $price = (float) ($item['unit_price'] ?? 0);
                $taxRate = (float) ($item['tax_rate'] ?? 0);
                $discount = (float) ($item['discount'] ?? 0);

                $baseAmount = $quantity * $price;
                $tax = $baseAmount * $taxRate / 100;
                $total = max(0, $baseAmount + $tax - $discount);

                return array_merge($item, [
                    'discount' => $discount,
                    'total' => round($total, 2),
                ]);
            })
            ->values()
            ->all();

        $subtotal = collect($items)->sum('total');
        $taxAmount = (float) $this->input('tax_amount', 0);
        $discountAmount = (float) $this->input('discount_amount', 0);
        $shippingCharge = (float) $this->input('shipping_charge', 0);
        $totalAmount = max(0, $subtotal + $taxAmount - $discountAmount + $shippingCharge);

        $this->merge([
            'organization_id' => $organizationId,
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'shipping_charge' => $shippingCharge,
            'total_amount' => round($totalAmount, 2),
        ]);
    }



    public function rules(): array
    {
        $purchase = $this->route('purchase');
        $purchaseId = $purchase instanceof Purchase ? $purchase->id : null;
        $organizationId = $this->input('organization_id');

        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'branch_id' => ['nullable', Rule::exists('branches', 'id')->whereNull('deleted_at')],
            'supplier_id' => ['required', Rule::exists('suppliers', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'warehouse_id' => ['nullable', Rule::exists('warehouses', 'id')->whereNull('deleted_at')],
            'reference_no' => ['required', 'string', 'max:100', Rule::unique('purchases', 'reference_no')->where('organization_id', $organizationId)->ignore($purchaseId)],
            'purchase_date' => ['required', 'date'],
            'subtotal' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'shipping_charge' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0', 'lte:total_amount'],
            'payment_status' => ['required', Rule::in(['paid', 'partial', 'due'])],
            'status' => ['required', Rule::in(['pending', 'completed', 'cancelled'])],
            'notes' => ['nullable', 'string', 'max:2000'],
            
            'payment_account_id' => [
                'nullable',
                Rule::exists('accounts', 'id')->whereNull('deleted_at')->where('organization_id', $organizationId),
            ],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', Rule::exists('products', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'items.*.total' => ['required', 'numeric', 'min:0'],
        ];
    }


    public function messages(): array
    {
        return [
            'supplier_id.required' => 'Please select a supplier.',
            'supplier_id.exists' => 'Selected supplier does not exist or is inactive.',
            'reference_no.required' => 'Reference number is required.',
            'reference_no.unique' => 'This reference number already exists.',
            'purchase_date.required' => 'Purchase date is required.',
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
            'items.*.product_id.required' => 'Please select a product.',
            'items.*.product_id.exists' => 'Selected product does not exist or is inactive.',
            'items.*.quantity.required' => 'Product quantity is required.',
            'items.*.quantity.min' => 'Product quantity must be at least 1.',
            'paid_amount.lte' => 'Paid amount cannot exceed purchase total.',
        ];
    }

    
}