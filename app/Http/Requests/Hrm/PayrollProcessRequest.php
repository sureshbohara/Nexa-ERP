<?php

namespace App\Http\Requests\Hrm;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PayrollProcessRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('branch_id') === '' || $this->input('branch_id') === null) {
            $this->merge(['branch_id' => null]);
        }
    }

    public function rules(): array
    {
        $user = $this->user();
        $organizationId = $user?->organization_id;

        return [
            'branch_id' => [
                'nullable',
                'integer',
                Rule::exists('branches', 'id')->where(function ($query) use ($organizationId): void {
                    if ($organizationId) {
                        $query->where('organization_id', $organizationId);
                    } else {
                        $query->whereIn('organization_id', [1, null]);
                    }
                }),
            ],
            'payroll_period' => ['required', 'date_format:Y-m'],
            'start_date' => ['required', 'date_format:Y-m-d', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $period = $this->input('payroll_period');
            $startDate = $this->input('start_date');
            $endDate = $this->input('end_date');

            if (is_string($period) && preg_match('/^\d{4}-\d{2}$/', $period) && is_string($startDate) && substr($startDate, 0, 7) !== $period) {
                $validator->errors()->add('start_date', 'The start date must be inside the selected payroll month.');
            }

            if (is_string($period) && preg_match('/^\d{4}-\d{2}$/', $period) && is_string($endDate) && substr($endDate, 0, 7) !== $period) {
                $validator->errors()->add('end_date', 'The end date must be inside the selected payroll month.');
            }
        });
    }
}