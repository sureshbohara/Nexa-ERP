<?php

namespace App\Http\Requests\Accounting;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JournalEntryRequest extends FormRequest
{
    public function authorize(): bool 
    { 
        return true; 
    }

    protected function prepareForValidation(): void
    {
        $organizationId = $this->input('organization_id') 
            ?? $this->route('journalEntry')?->organization_id
            ?? auth()->user()?->organization_id
            ?? Organization::value('id');

        $this->merge(['organization_id' => $organizationId]);

  
        $items = collect($this->input('items', []))->map(function ($item) {
            return [
                'account_id' => $item['account_id'] ?? null,
                'description' => $item['description'] ?? null,
                'debit' => (float)($item['debit'] ?? 0),
                'credit' => (float)($item['credit'] ?? 0),
            ];
        })->toArray();

        $this->merge(['items' => $items]);

        $totalDebit = collect($items)->sum('debit');
        $totalCredit = collect($items)->sum('credit');
        
        $this->merge([
            'total_debit' => round($totalDebit, 2),
            'total_credit' => round($totalCredit, 2),
        ]);
    }

    public function rules(): array
    {
        $journalEntryId = $this->route('journalEntry')?->id;
        $organizationId = $this->input('organization_id');

        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'branch_id' => ['nullable', Rule::exists('branches', 'id')->whereNull('deleted_at')],
            'reference_no' => [
                'required', 'string', 'max:100',
                Rule::unique('journal_entries', 'reference_no')->ignore($journalEntryId)
            ],
            'entry_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['draft', 'posted', 'cancelled'])],
            'notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:2'],
            'items.*.account_id' => [
                'required',
                Rule::exists('accounts', 'id')->whereNull('deleted_at')->where('organization_id', $organizationId)
            ],
            'items.*.description' => ['nullable', 'string', 'max:500'],
            'items.*.debit' => ['nullable', 'numeric', 'min:0'],
            'items.*.credit' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $totalDebit = (float) $this->input('total_debit', 0);
            $totalCredit = (float) $this->input('total_credit', 0);

            if (abs($totalDebit - $totalCredit) > 0.01) {
                $validator->errors()->add(
                    'items',
                    "Journal entry must be balanced. Total Debit: " . number_format($totalDebit, 2) . ", Total Credit: " . number_format($totalCredit, 2)
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'reference_no.required' => 'Reference number is required.',
            'reference_no.unique' => 'This reference number already exists.',
            'entry_date.required' => 'Entry date is required.',
            'items.min' => 'At least two journal items are required for a balanced entry.',
            'items' => 'Total debits must equal total credits.',
        ];
    }
}