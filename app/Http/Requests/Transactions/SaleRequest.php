<?php

namespace App\Http\Requests\Transactions;

use App\Models\Organization;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Sale;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SaleRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        $user = $this->user();
        $sale = $this->route('sale');

        $organizationId = $this->input('organization_id')
            ?? $user?->organization_id
            ?? ($sale instanceof Sale ? $sale->organization_id : null)
            ?? Organization::value('id');

        $branchId = $this->input('branch_id')
            ?? $user?->branch_id
            ?? ($sale instanceof Sale ? $sale->branch_id : null);

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
                    'quantity' => (int) $quantity,
                    'unit_price' => round($price, 2),
                    'discount' => round($discount, 2),
                    'tax_rate' => round($taxRate, 2),
                    'tax_amount' => round($tax, 2),
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
        
        $paidAmount = (float) $this->input('paid_amount', 0);
        $dueAmount = max(0, $totalAmount - $paidAmount);

        $paymentStatus = $this->input('payment_status');
        if (!$paymentStatus) {
            if ($paidAmount <= 0) $paymentStatus = 'due';
            elseif ($paidAmount >= $totalAmount) $paymentStatus = 'paid';
            else $paymentStatus = 'partial';
        }

        $referenceNo = $this->input('reference_no');
        if (empty($referenceNo) && !$sale) {
            $lastSale = Sale::latest('id')->first();
            $nextNumber = $lastSale ? (intval(substr($lastSale->reference_no, 4)) + 1) : 1;
            $referenceNo = 'INV-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        }

        $this->merge([
            'organization_id' => $organizationId,
            'branch_id' => $branchId,
            'reference_no' => $referenceNo,
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'tax_amount' => round($taxAmount, 2),
            'discount_amount' => round($discountAmount, 2),
            'shipping_charge' => round($shippingCharge, 2),
            'total_amount' => round($totalAmount, 2),
            'paid_amount' => round($paidAmount, 2),
            'due_amount' => round($dueAmount, 2),
            'payment_status' => $paymentStatus,
        ]);
    }

    public function rules(): array
    {
        $sale = $this->route('sale');
        $saleId = $sale instanceof Sale ? $sale->id : null;
        $organizationId = $this->input('organization_id');

        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'branch_id' => ['nullable', Rule::exists('branches', 'id')->whereNull('deleted_at')],
            'customer_id' => ['required', Rule::exists('customers', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'warehouse_id' => ['required', Rule::exists('warehouses', 'id')->whereNull('deleted_at')],
            'reference_no' => ['required', 'string', 'max:100', Rule::unique('sales', 'reference_no')->where('organization_id', $organizationId)->ignore($saleId)],
            'sale_date' => ['required', 'date'],
            'subtotal' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'shipping_charge' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'due_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['required', Rule::in(['paid', 'partial', 'due'])],
            'delivery_status' => ['nullable', Rule::in(['pending', 'processing', 'delivered', 'cancelled'])],
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
            'items.*.serial_number' => ['nullable', 'string', 'max:100'],
            'items.*.batch_number' => ['nullable', 'string', 'max:100'],
        ];
    }


    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $warehouseId = $this->input('warehouse_id');
            if ($warehouseId) {
                foreach ($this->input('items', []) as $index => $item) {
                    $productId = $item['product_id'] ?? null;
                    $qty = (int) ($item['quantity'] ?? 0);
                    if ($productId) {
                        $availableStock = ProductStock::where('product_id', $productId)
                            ->where('warehouse_id', $warehouseId)
                            ->sum('quantity');
                        if ($qty > $availableStock) {
                            $productName = Product::find($productId)?->name ?? 'Unknown Product';
                            $validator->errors()->add(
                                "items.{$index}.quantity",
                                "Insufficient stock for '{$productName}'. Available in this warehouse: {$availableStock}, Requested: {$qty}."
                            );
                        }
                    }
                }
            }
        });
    }


    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Please select a warehouse.',
            'customer_id.required' => 'Please select a customer.',
            'customer_id.exists' => 'Selected customer does not exist or is inactive.',
            'reference_no.required' => 'Invoice number is required.',
            'reference_no.unique' => 'This invoice number already exists.',
            'sale_date.required' => 'Sale date is required.',
            'items.required' => 'At least one item is required.',
            'items.min' => 'At least one item is required.',
            'items.*.product_id.required' => 'Please select a product.',
            'items.*.product_id.exists' => 'Selected product does not exist or is inactive.',
            'items.*.quantity.required' => 'Product quantity is required.',
            'items.*.quantity.min' => 'Product quantity must be at least 1.',
        ];
    }
}