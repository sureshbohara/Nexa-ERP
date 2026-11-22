<?php

namespace App\Http\Requests\Accounting;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExpenseRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        $organizationId = $this->input('organization_id') 
            ?? $this->route('expense')?->organization_id
            ?? auth()->user()?->organization_id
            ?? Organization::value('id');

        $amount = (float) ($this->input('amount') ?? 0);
        $taxAmount = (float) ($this->input('tax_amount') ?? 0);

        $this->merge([
            'organization_id' => $organizationId,
            'tax_amount' => $taxAmount, 
            'total_amount' => round($amount + $taxAmount, 2),
        ]);
    }

    public function rules(): array
    {
        $expenseId = $this->route('expense')?->id;
        $organizationId = $this->input('organization_id');

        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'branch_id' => ['nullable', Rule::exists('branches', 'id')->whereNull('deleted_at')],
            'account_id' => ['required', Rule::exists('accounts', 'id')->whereNull('deleted_at')->where('organization_id', $organizationId)->where('type', 'expense')],
            'reference_no' => ['required', 'string', 'max:100', Rule::unique('expenses', 'reference_no')->ignore($expenseId)],
            'expense_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', Rule::in(['cash', 'bank_transfer', 'cheque', 'online', 'other'])],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'reference_document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
    
            'payment_account_id' => [
                'nullable',
                Rule::exists('accounts', 'id')->whereNull('deleted_at')->where('organization_id', $organizationId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'account_id.required' => 'Please select an expense account.',
            'reference_no.required' => 'Reference number is required.',
            'reference_no.unique' => 'This reference number already exists.',
            'expense_date.required' => 'Expense date is required.',
            'amount.required' => 'Amount is required.',
            'amount.min' => 'Amount cannot be negative.',
            'total_amount.required' => 'Total amount is required.',
            'payment_method.required' => 'Please select a payment method.',
            'reference_document.mimes' => 'Document must be a PDF, JPG, JPEG, or PNG file.',
            'reference_document.max' => 'Document size must not exceed 5MB.',
        ];
    }
}